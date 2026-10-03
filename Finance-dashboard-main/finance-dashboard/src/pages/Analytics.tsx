// src/pages/Analytics.tsx
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { TrendingUp, TrendingDown, Calendar, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, getMonthlyData, getCategoryData } from '../utils/helpers';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ComposedChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const Analytics: React.FC = () => {
  const { transactions } = useStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  const monthlyData = getMonthlyData(transactions);
  const categoryData = getCategoryData(transactions);
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  
  const radarData = categoryData.map(cat => ({
    subject: cat.name,
    value: cat.value,
    fullMark: Math.max(...categoryData.map(c => c.value)) * 1.2,
  }));

  const getDailyData = () => {
    const dailyMap = new Map();
    transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, income: 0, expense: 0 });
      }
      const data = dailyMap.get(date);
      if (t.type === 'income') {
        data.income += t.amount;
      } else {
        data.expense += t.amount;
      }
    });
    return Array.from(dailyMap.values()).slice(-7);
  };

  const dailyData = getDailyData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Advanced Analytics
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Deep insights into your financial patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Savings</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(netSavings)}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <ArrowUpRight className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Savings Rate: {savingsRate.toFixed(1)}%</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Income/Expense Ratio</p>
              <p className="text-2xl font-bold">{(totalIncome / totalExpenses).toFixed(1)}x</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Income is {((totalIncome / totalExpenses) * 100).toFixed(0)}% of expenses</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Transaction</p>
              <p className="text-2xl font-bold">{formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length || 0)}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <CreditCard className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Across {transactions.length} transactions</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Transaction Frequency</p>
              <p className="text-2xl font-bold">{(transactions.length / 30).toFixed(1)}/day</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Average daily transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => {
                                  if (value === undefined || value === null) return '';
                                  return formatCurrency(Number(value));
                                }} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
              <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2} name="Balance" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Category Distribution Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" />
              <PolarRadiusAxis stroke="#9CA3AF" />
              <Radar name="Spending" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Tooltip formatter={(value) => {
                                  if (value === undefined || value === null) return '';
                                  return formatCurrency(Number(value));
                                }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Last 7 Days Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value}`} />
            <Tooltip formatter={(value) => {
                                if (value === undefined || value === null) return '';
                                return formatCurrency(Number(value));
                              }} />
            <Legend />
            <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Income" />
            <Area type="monotone" dataKey="expense" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <h3 className="text-lg font-semibold mb-4">Financial Health Score</h3>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-center">
            <div className="text-5xl font-bold">{Math.min(100, Math.floor(savingsRate * 2 + 50))}</div>
            <p className="text-sm opacity-90 mt-1">out of 100</p>
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Savings Rate</span>
                  <span>{savingsRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${Math.min(100, savingsRate)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Budget Adherence</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Transaction Consistency</span>
                  <span>72%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm mt-4 text-center opacity-90">
          {savingsRate > 20 ? "Excellent! You're on the right track!" : "Keep working on improving your savings!"}
        </p>
      </div>
    </div>
  );
};

export default Analytics;