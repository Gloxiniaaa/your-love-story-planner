import api from "@/api/api-client";
import type { Category, CategoryResponseDto, Expense, ExpenseResponseDto } from "./types";
import {
  categoryToCreateDto,
  categoryToUpdateDto,
  dtoToCategory,
  dtoToExpense,
  expenseToCreateDto,
  expenseToUpdateDto,
} from "./types";

function mapExpense(dto: ExpenseResponseDto): Expense {
  return dtoToExpense(dto);
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<CategoryResponseDto[]>("/api/wedding/expenses/categories");
  return (res.data ?? []).map(dtoToCategory);
}

export async function createCategory(data: { name: string; emoji: string }): Promise<Category> {
  const res = await api.post<CategoryResponseDto>("/api/wedding/expenses/categories", categoryToCreateDto(data));
  return dtoToCategory(res.data);
}

export async function updateCategory(id: string, data: { name: string; emoji: string }): Promise<Category> {
  const res = await api.put<CategoryResponseDto>(
    `/api/wedding/expenses/categories/${id}`,
    categoryToUpdateDto(data)
  );
  return dtoToCategory(res.data);
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/api/wedding/expenses/categories/${id}`);
}

export async function createExpense(categoryId: string, data: Omit<Expense, "id">): Promise<Expense> {
  const res = await api.post<ExpenseResponseDto>(
    `/api/wedding/expenses/categories/${categoryId}/items`,
    expenseToCreateDto(data)
  );
  return mapExpense(res.data);
}

export async function updateExpense(id: string, data: Partial<Omit<Expense, "id">>): Promise<Expense> {
  const res = await api.put<ExpenseResponseDto>(
    `/api/wedding/expenses/items/${id}`,
    expenseToUpdateDto(data)
  );
  return mapExpense(res.data);
}

export async function toggleExpensePaid(id: string): Promise<Expense> {
  const res = await api.patch<ExpenseResponseDto>(`/api/wedding/expenses/items/${id}/toggle`);
  return mapExpense(res.data);
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/api/wedding/expenses/items/${id}`);
}
