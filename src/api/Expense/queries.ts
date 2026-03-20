import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Expense } from "./types";
import {
  createCategory,
  createExpense,
  deleteCategory,
  deleteExpense,
  getCategories,
  toggleExpensePaid,
  updateCategory,
  updateExpense,
} from "./api";

const CATEGORIES_KEY = ["expenses", "categories"] as const;

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_KEY,
    queryFn: getCategories,
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (created) => {
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old) => (old ? [created, ...old] : [created]));
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; emoji: string } }) =>
      updateCategory(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_KEY });
      const previous = queryClient.getQueryData<Category[]>(CATEGORIES_KEY);
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old) =>
        (old ?? []).map((c) => (c.id === id ? { ...c, ...data } : c))
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CATEGORIES_KEY, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_KEY });
      const previous = queryClient.getQueryData<Category[]>(CATEGORIES_KEY);
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old) => (old ?? []).filter((c) => c.id !== id));
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CATEGORIES_KEY, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: Omit<Expense, "id"> }) =>
      createExpense(categoryId, data),
    onSuccess: (created, { categoryId }) => {
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old) =>
        (old ?? []).map((c) =>
          c.id === categoryId ? { ...c, expenses: [created, ...c.expenses] } : c
        )
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Expense, "id"> }) => updateExpense(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_KEY });
      const previous = queryClient.getQueryData<Category[]>(CATEGORIES_KEY);
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old) =>
        (old ?? []).map((c) => ({
          ...c,
          expenses: c.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
        }))
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CATEGORIES_KEY, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useToggleExpensePaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleExpensePaid,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_KEY });
      const previous = queryClient.getQueryData<Category[]>(CATEGORIES_KEY);
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old) =>
        (old ?? []).map((c) => ({
          ...c,
          expenses: c.expenses.map((e) => (e.id === id ? { ...e, paid: !e.paid } : e)),
        }))
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CATEGORIES_KEY, ctx.previous);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old) =>
        (old ?? []).map((c) => ({
          ...c,
          expenses: c.expenses.map((e) => (e.id === updated.id ? updated : e)),
        }))
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CATEGORIES_KEY });
      const previous = queryClient.getQueryData<Category[]>(CATEGORIES_KEY);
      queryClient.setQueryData<Category[]>(CATEGORIES_KEY, (old) =>
        (old ?? []).map((c) => ({
          ...c,
          expenses: c.expenses.filter((e) => e.id !== id),
        }))
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CATEGORIES_KEY, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
