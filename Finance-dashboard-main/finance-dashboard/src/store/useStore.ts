// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Role, Filters } from '../types';

// Mock initial transactions
const initialTransactions: Transaction[] = [
  { id: '1', date: '2024-03-15', description: 'Salary Deposit', amount: 5000, category: 'Salary', type: 'income' },
  { id: '2', date: '2024-03-18', description: 'Grocery Shopping', amount: 150, category: 'Food', type: 'expense' },
  { id: '3', date: '2024-03-20', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', type: 'expense' },
  { id: '4', date: '2024-03-22', description: 'Electricity Bill', amount: 85.50, category: 'Bills', type: 'expense' },
  { id: '5', date: '2024-03-25', description: 'Freelance Work', amount: 800, category: 'Salary', type: 'income' },
  { id: '6', date: '2024-03-28', description: 'Restaurant Dinner', amount: 65, category: 'Food', type: 'expense' },
  { id: '7', date: '2024-04-02', description: 'New Shoes', amount: 120, category: 'Shopping', type: 'expense' },
  { id: '8', date: '2024-04-05', description: 'Gym Membership', amount: 50, category: 'Health', type: 'expense' },
  { id: '9', date: '2024-04-08', description: 'Investment Return', amount: 300, category: 'Investment', type: 'income' },
  { id: '10', date: '2024-04-10', description: 'Coffee Shop', amount: 12, category: 'Food', type: 'expense' },
];

interface StoreState {
  transactions: Transaction[];
  role: Role;
  filters: Filters;
  darkMode: boolean;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  setRole: (role: Role) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updated: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<Filters>) => void;
  toggleDarkMode: () => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'admin',
      filters: {
        search: '',
        typeFilter: 'all',
        sortBy: 'date-desc',
      },
      darkMode: false,
      notification: null,
      
      setRole: (role) => set({ role }),
      
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
        
      updateTransaction: (id, updated) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? updated : t
          ),
        })),
        
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
        
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
        
      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode;
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: newDarkMode };
        }),
        
      showNotification: (message, type) => {
        set({ notification: { message, type } });
        setTimeout(() => set({ notification: null }), 3000);
      },
      
      hideNotification: () => set({ notification: null }),
    }),
    {
      name: 'finance-dashboard-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);