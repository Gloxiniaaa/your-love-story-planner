import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyWedding, createWedding, updateWedding } from "./api";
import type { WeddingInfo } from "./types";

const WEDDING_KEY = ["wedding", "mine"] as const;

export function useMyWedding() {
  return useQuery<WeddingInfo | null, Error>({
    queryKey: WEDDING_KEY,
    queryFn: getMyWedding,
    // Only fetch when user is logged in (you can also check auth context)
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 5 * 60 * 1000,     // 5 minutes — tune as needed
    gcTime: 10 * 60 * 1000,       // garbage collect after 10 min
  });
}

export function useCreateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWedding,
    onSuccess: (newWedding) => {
      queryClient.setQueryData(WEDDING_KEY, newWedding);
      // or queryClient.invalidateQueries({ queryKey: WEDDING_KEY });
    },
  });
}

export function useUpdateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWedding,
    onMutate: async (updates) => {
      // Optimistic update — very nice UX
      await queryClient.cancelQueries({ queryKey: WEDDING_KEY });
      const previous = queryClient.getQueryData<WeddingInfo>(WEDDING_KEY);
      queryClient.setQueryData<WeddingInfo>(WEDDING_KEY, (old) =>
        old ? { ...old, ...updates } : old
      );
      return { previous };
    },
    onError: (err, updates, context) => {
      // rollback on error
      if (context?.previous) {
        queryClient.setQueryData(WEDDING_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WEDDING_KEY });
    },
  });
}