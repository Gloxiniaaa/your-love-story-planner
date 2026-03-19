import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Milestone } from "./types";
import {
  createMilestone,
  deleteMilestone,
  getMilestones,
  toggleMilestoneCompleted,
  updateMilestone,
} from "./api";

const MILESTONES_KEY = ["milestones", "mine"] as const;

export function useMilestones() {
  return useQuery<Milestone[], Error>({
    queryKey: MILESTONES_KEY,
    queryFn: getMilestones,
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilestone,
    onSuccess: (created) => {
      queryClient.setQueryData<Milestone[]>(MILESTONES_KEY, (old) => (old ? [...old, created] : [created]));
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Milestone> }) => updateMilestone(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: MILESTONES_KEY });
      const previous = queryClient.getQueryData<Milestone[]>(MILESTONES_KEY);
      queryClient.setQueryData<Milestone[]>(MILESTONES_KEY, (old) =>
        (old ?? []).map((m) => (m.id === id ? { ...m, ...data } : m))
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(MILESTONES_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MILESTONES_KEY });
    },
  });
}

export function useToggleMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleMilestoneCompleted,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: MILESTONES_KEY });
      const previous = queryClient.getQueryData<Milestone[]>(MILESTONES_KEY);
      queryClient.setQueryData<Milestone[]>(MILESTONES_KEY, (old) =>
        (old ?? []).map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(MILESTONES_KEY, ctx.previous);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Milestone[]>(MILESTONES_KEY, (old) =>
        (old ?? []).map((m) => (m.id === updated.id ? updated : m))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MILESTONES_KEY });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMilestone,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: MILESTONES_KEY });
      const previous = queryClient.getQueryData<Milestone[]>(MILESTONES_KEY);
      queryClient.setQueryData<Milestone[]>(MILESTONES_KEY, (old) => (old ?? []).filter((m) => m.id !== id));
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(MILESTONES_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MILESTONES_KEY });
    },
  });
}

