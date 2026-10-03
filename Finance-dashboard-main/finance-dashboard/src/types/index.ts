// src/types/index.ts
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export type Role = 'admin' | 'viewer';

export interface Filters {
  search: string;
  typeFilter: 'all' | 'income' | 'expense';
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}