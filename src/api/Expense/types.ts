import type { Category, Expense } from "@/components/expenses/types";

export type { Category, Expense };

/** API: category with nested expenses */
export interface CategoryResponseDto {
  id: string;
  name: string;
  emoji: string;
  expenses: ExpenseResponseDto[];
}

/** API: single expense */
export interface ExpenseResponseDto {
  id: string;
  name: string;
  estimateCost: number;
  actualCost: number;
  paid: boolean;
  categoryId: string;
}

export interface CreateCategoryDto {
  name: string;
  emoji: string;
}

export interface UpdateCategoryDto {
  name: string;
  emoji: string;
}

export interface CreateExpenseDto {
  name: string;
  estimateCost: number;
  actualCost: number;
  paid: boolean;
}

export interface UpdateExpenseDto {
  name: string;
  estimateCost: number;
  actualCost: number;
  paid: boolean;
}

export function dtoToExpense(dto: ExpenseResponseDto): Expense {
  return {
    id: dto.id,
    name: dto.name ?? "",
    estimateCost: dto.estimateCost ?? 0,
    actualCost: dto.actualCost ?? 0,
    paid: !!dto.paid,
  };
}

export function dtoToCategory(dto: CategoryResponseDto): Category {
  return {
    id: dto.id,
    name: dto.name ?? "",
    emoji: dto.emoji ?? "📋",
    expenses: (dto.expenses ?? []).map(dtoToExpense),
  };
}

export function categoryToCreateDto(c: { name: string; emoji: string }): CreateCategoryDto {
  return { name: c.name.trim(), emoji: (c.emoji || "📋").trim() };
}

export function categoryToUpdateDto(c: { name: string; emoji: string }): UpdateCategoryDto {
  return { name: c.name.trim(), emoji: (c.emoji || "📋").trim() };
}

export function expenseToCreateDto(e: Omit<Expense, "id">): CreateExpenseDto {
  return {
    name: e.name.trim(),
    estimateCost: e.estimateCost ?? 0,
    actualCost: e.actualCost ?? 0,
    paid: !!e.paid,
  };
}

export function expenseToUpdateDto(e: Partial<Expense>): UpdateExpenseDto {
  return {
    name: (e.name ?? "").trim(),
    estimateCost: e.estimateCost ?? 0,
    actualCost: e.actualCost ?? 0,
    paid: !!e.paid,
  };
}
