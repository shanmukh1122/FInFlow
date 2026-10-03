// src/utils/helpers.ts
import type { Transaction } from '../types/index';
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getTotalBalance = (transactions: Transaction[]): number => {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return income - expenses;
};

export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const getMonthlyData = (transactions: Transaction[]) => {
  const monthlyMap = new Map();
  
  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { month: monthName, income: 0, expense: 0, balance: 0 });
    }
    
    const data = monthlyMap.get(monthKey);
    if (t.type === 'income') {
      data.income += t.amount;
    } else {
      data.expense += t.amount;
    }
    data.balance = data.income - data.expense;
  });
  
  return Array.from(monthlyMap.values()).sort((a, b) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime();
  });
};

export const getCategoryData = (transactions: Transaction[]) => {
  const categoryMap = new Map();
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });
  
  return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
};

export const getHighestSpendingCategory = (transactions: Transaction[]): string => {
  const categoryData = getCategoryData(transactions);
  if (categoryData.length === 0) return 'N/A';
  const highest = categoryData.reduce((max, curr) => curr.value > max.value ? curr : max);
  return highest.name;
};

export const getMonthlyComparison = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const currentExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);
    
  const previousExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);
    
  const percentChange = previousExpenses === 0 ? 0 : ((currentExpenses - previousExpenses) / previousExpenses) * 100;
  
  return {
    current: currentExpenses,
    previous: previousExpenses,
    percentChange,
  };
};