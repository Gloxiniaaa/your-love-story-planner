import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Guest } from "./types";
import {
  createGuest,
  deleteGuest,
  getGuests,
  toggleGuestConfirmed,
  updateGuest,
} from "./api";

const GUESTS_KEY = ["guests", "mine"] as const;

export function useGuests() {
  return useQuery<Guest[], Error>({
    queryKey: GUESTS_KEY,
    queryFn: getGuests,
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGuest,
    onSuccess: (created) => {
      queryClient.setQueryData<Guest[]>(GUESTS_KEY, (old) => (old ? [...old, created] : [created]));
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateGuest>[1] }) => updateGuest(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: GUESTS_KEY });
      const previous = queryClient.getQueryData<Guest[]>(GUESTS_KEY);
      queryClient.setQueryData<Guest[]>(GUESTS_KEY, (old) =>
        (old ?? []).map((g) => (g.id === id ? { ...g, ...data } : g))
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(GUESTS_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GUESTS_KEY });
    },
  });
}

export function useToggleGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleGuestConfirmed,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: GUESTS_KEY });
      const previous = queryClient.getQueryData<Guest[]>(GUESTS_KEY);
      queryClient.setQueryData<Guest[]>(GUESTS_KEY, (old) =>
        (old ?? []).map((g) => (g.id === id ? { ...g, confirmed: !g.confirmed } : g))
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(GUESTS_KEY, ctx.previous);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Guest[]>(GUESTS_KEY, (old) =>
        (old ?? []).map((g) => (g.id === updated.id ? updated : g))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GUESTS_KEY });
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGuest,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: GUESTS_KEY });
      const previous = queryClient.getQueryData<Guest[]>(GUESTS_KEY);
      queryClient.setQueryData<Guest[]>(GUESTS_KEY, (old) => (old ?? []).filter((g) => g.id !== id));
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(GUESTS_KEY, ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GUESTS_KEY });
    },
  });
}
