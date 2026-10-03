// src/pages/Budgets.tsx
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Target, Plus, Edit2, Trash2, TrendingUp, AlertCircle, CheckCircle, PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency, getCategoryData } from '../utils/helpers';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec489a'];

const Budgets: React.FC = () => {
  const { transactions, showNotification } = useStore();
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food', limit: 500, spent: 227, period: 'monthly' },
    { id: '2', category: 'Shopping', limit: 300, spent: 120, period: 'monthly' },
    { id: '3', category: 'Entertainment', limit: 150, spent: 15.99, period: 'monthly' },
    { id: '4', category: 'Bills', limit: 400, spent: 85.50, period: 'monthly' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({ category: '', limit: '', period: 'monthly' });

  const categoryData = getCategoryData(transactions);
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalBudgeted - totalSpent;

  const handleAddBudget = () => {
    if (!formData.category || !formData.limit) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    
    const newBudget: Budget = {
      id: Date.now().toString(),
      category: formData.category,
      limit: parseFloat(formData.limit),
      spent: 0,
      period: formData.period as 'monthly' | 'weekly' | 'yearly',
    };
    
    setBudgets([...budgets, newBudget]);
    showNotification('Budget created successfully!', 'success');
    setIsModalOpen(false);
    setFormData({ category: '', limit: '', period: 'monthly' });
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return { color: 'red', icon: AlertCircle, text: 'Critical' };
    if (percentage >= 75) return { color: 'yellow', icon: TrendingUp, text: 'Warning' };
    return { color: 'green', icon: CheckCircle, text: 'Good' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Budget Planner
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Set and track your spending limits</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create Budget
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <Target className="mb-2" size={24} />
          <p className="text-sm opacity-90">Total Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(totalBudgeted)}</p>
        </div>
        <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <PieChartIcon className="mb-2" size={24} />
          <p className="text-sm opacity-90">Total Spent</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CheckCircle className="mb-2" size={24} />
          <p className="text-sm opacity-90">Remaining</p>
          <p className="text-2xl font-bold">{formatCurrency(remainingBudget)}</p>
        </div>
      </div>

      {/* Budget List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Active Budgets</h3>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const status = getBudgetStatus(budget.spent, budget.limit);
            const percentage = (budget.spent / budget.limit) * 100;
            const StatusIcon = status.icon;
            
            return (
              <div key={budget.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h4>
                    <p className="text-xs text-gray-500">{budget.period} budget</p>
                  </div>
                  <div className={`flex items-center gap-1 text-${status.color}-600`}>
                    <StatusIcon size={16} />
                    <span className="text-xs font-medium">{status.text}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Spent: {formatCurrency(budget.spent)}</span>
                  <span>Limit: {formatCurrency(budget.limit)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 bg-${status.color}-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {percentage.toFixed(1)}% used • {formatCurrency(budget.limit - budget.spent)} remaining
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Create New Budget</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category (e.g., Food, Shopping)"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="input-field"
                list="budgetCategories"
              />
              <datalist id="budgetCategories">
                <option>Food</option>
                <option>Shopping</option>
                <option>Entertainment</option>
                <option>Bills</option>
                <option>Health</option>
                <option>Transport</option>
              </datalist>
              <input
                type="number"
                placeholder="Monthly Limit"
                value={formData.limit}
                onChange={(e) => setFormData({...formData, limit: e.target.value})}
                className="input-field"
              />
              <select
                value={formData.period}
                onChange={(e) => setFormData({...formData, period: e.target.value})}
                className="input-field"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button onClick={handleAddBudget} className="btn-primary w-full">Create Budget</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;