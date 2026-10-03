// src/pages/Transactions.tsx
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Search, Filter, SortAsc, SortDesc, Plus, Edit2, Trash2, X, Download, TrendingUp, TrendingDown, Calendar, Tag } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import type { Transaction } from '../types';

const Transactions: React.FC = () => {
  const { transactions, role, filters, setFilters, addTransaction, updateTransaction, deleteTransaction, showNotification } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    type: 'expense' as 'income' | 'expense',
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                          t.category.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.typeFilter === 'all' || t.type === filters.typeFilter;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (filters.sortBy) {
      case 'date-desc': return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'amount-desc': return b.amount - a.amount;
      case 'amount-asc': return a.amount - b.amount;
      default: return 0;
    }
  });

  const handleOpenModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: transaction.date,
        type: transaction.type,
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }
    
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        ...editingTransaction,
        ...formData,
        amount: amountNum,
      });
      showNotification('Transaction updated successfully!', 'success');
    } else {
      addTransaction({
        id: Date.now().toString(),
        date: formData.date,
        description: formData.description,
        amount: amountNum,
        category: formData.category,
        type: formData.type,
      });
      showNotification('Transaction added successfully!', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      showNotification('Transaction deleted successfully!', 'success');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvData = transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount.toString()
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Export complete!', 'success');
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Transactions
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your financial activities</p>
        </div>
        <div className="flex gap-3">
          {role === 'admin' && (
            <>
              <button onClick={exportToCSV} className="btn-secondary flex items-center gap-2">
                <Download size={18} />
                Export CSV
              </button>
              <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                <Plus size={18} />
                Add Transaction
              </button>
            </>
          )}
        </div>
      </div>
      
       
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
          <p className="text-2xl font-bold text-green-600">+{formatCurrency(totalIncome)}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">-{formatCurrency(totalExpenses)}</p>
        </div>
      </div>
      
     
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <select
            value={filters.typeFilter}
            onChange={(e) => setFilters({ typeFilter: e.target.value as any })}
            className="input-field w-auto"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
          
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as any })}
            className="input-field w-auto"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>
     
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Description</th>
                <th className="text-left py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Category</th>
                <th className="text-left py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Type</th>
                <th className="text-right py-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                {role === 'admin' && <th className="text-right py-4 text-sm font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((t) => (
                  <tr key={t.id} className="table-row border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(t.date)}
                      </div>
                    </td>
                    <td className="py-3 text-sm font-medium">{t.description}</td>
                    <td className="py-3 text-sm">
                      <span className="badge">
                        <Tag size={12} className="inline mr-1" />
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type === 'income' ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                        {t.type}
                      </span>
                    </td>
                    <td className={`py-3 text-sm text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    {role === 'admin' && (
                      <td className="py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleOpenModal(t)} 
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(t.id)} 
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="text-center py-12 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                className="input-field"
                autoFocus
              />
              <input 
                type="number" 
                placeholder="Amount" 
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                className="input-field"
              />
              <input 
                type="text" 
                placeholder="Category" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                className="input-field"
                list="categories"
              />
              <datalist id="categories">
                <option>Food</option>
                <option>Salary</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Entertainment</option>
                <option>Health</option>
                <option>Investment</option>
                <option>Transport</option>
              </datalist>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                className="input-field"
              />
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value as any})} 
                className="input-field"
              >
                <option value="expense">Expense 💸</option>
                <option value="income">Income 💰</option>
              </select>
              <button onClick={handleSubmit} className="btn-primary w-full">
                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;