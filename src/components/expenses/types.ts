export interface Expense {
  id: string;
  name: string;
  estimateCost: number;
  actualCost: number;
  paid: boolean;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  expenses: Expense[];
}

export const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
