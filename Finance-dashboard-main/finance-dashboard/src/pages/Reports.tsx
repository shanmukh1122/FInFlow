// src/pages/Reports.tsx
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { FileText, Download, Calendar, Filter, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import { formatCurrency, getMonthlyData, getCategoryData } from '../utils/helpers';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Reports: React.FC = () => {
  const { transactions, showNotification } = useStore();
  const [reportType, setReportType] = useState<'monthly' | 'yearly' | 'category'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const monthlyData = getMonthlyData(transactions);
  const categoryData = getCategoryData(transactions);
  
  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });
  
  const monthlyIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const generateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      reportType,
      summary: {
        totalIncome: monthlyIncome,
        totalExpenses: monthlyExpenses,
        netSavings: monthlyIncome - monthlyExpenses,
        transactionCount: filteredTransactions.length,
      },
      topCategories: categoryData.sort((a, b) => b.value - a.value).slice(0, 3),
      monthlyTrend: monthlyData,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_report_${selectedYear}_${selectedMonth + 1}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Report generated successfully!', 'success');
  };
  
  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Financial Reports
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Generate and download detailed reports</p>
        </div>
        <button onClick={generateReport} className="btn-primary flex items-center gap-2">
          <Download size={18} />
          Generate Report
        </button>
      </div>
      
      <div className="card">
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <div className="flex gap-2">
              {(['monthly', 'yearly', 'category'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    reportType === type ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input-field"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input-field"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(monthlyIncome)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(monthlyExpenses)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <PieChart className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Net Savings</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(monthlyIncome - monthlyExpenses)}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <BarChart3 className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-bold">{filteredTransactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                    const pct = percent ?? 0;
                    return `${name} ${(pct * 100).toFixed(0)}%`;
                  }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip  formatter={(value) => {
                                  if (value === undefined || value === null) return '';
                                  return formatCurrency(Number(value));
                                }} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Monthly Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => {
                                  if (value === undefined || value === null) return '';
                                  return formatCurrency(Number(value));
                                }} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Transactions in {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Description</th>
                <th className="text-left py-3">Category</th>
                <th className="text-right py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(t => (
                  <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="py-2 text-sm">{t.description}</td>
                    <td className="py-2 text-sm">{t.category}</td>
                    <td className={`py-2 text-sm text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No transactions for this period</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;