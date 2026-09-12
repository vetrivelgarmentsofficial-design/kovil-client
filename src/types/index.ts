export type TransactionType = 'income' | 'expense';

export interface FunctionItem {
  _id: string;
  name: string;
  year: number | string;
  description?: string;
  startDate?: string;
  endDate?: string;
  totalIncome?: number;
  totalExpense?: number;
  balance?: number;
  transactionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionItem {
  _id: string;
  functionId: string;
  type: TransactionType;
  name: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface PersonBreakdown {
  name: string;
  total: number;
  count: number;
  categories: string[];
}

export interface FunctionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
  totalCount: number;
  incomeByCategory: CategoryBreakdown[];
  expenseByCategory: CategoryBreakdown[];
  incomeByPerson: PersonBreakdown[];
  expenseByPerson: PersonBreakdown[];
}

export type Language = 'ta' | 'en';
