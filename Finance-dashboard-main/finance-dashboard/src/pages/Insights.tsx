// src/pages/Insights.tsx
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { getHighestSpendingCategory, getMonthlyComparison, formatCurrency, getCategoryData } from '../utils/helpers';
import { TrendingUp, TrendingDown, Award, Calendar, Lightbulb, Target, AlertCircle, Smile } from 'lucide-react';

const Insights: React.FC = () => {
  const { transactions } = useStore();
  const highestCategory = getHighestSpendingCategory(transactions);
  const comparison = getMonthlyComparison(transactions);
  const categoryData = getCategoryData(transactions);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  
  const averageSpending = categoryData.length > 0 ? totalExpenses / categoryData.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Insights & Analytics
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Smart observations about your spending patterns</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card group hover:bg-gradient-to-br hover:from-primary-50 hover:to-transparent dark:hover:from-primary-900/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30 group-hover:scale-110 transition-transform">
              <Award className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Highest Spending Category</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{highestCategory}</p>
          <p className="text-sm text-gray-500">Consider setting a budget for this category</p>
        </div>
        
        <div className="card group hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent dark:hover:from-blue-900/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 group-hover:scale-110 transition-transform">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Change</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(comparison.current)}</p>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${comparison.percentChange <= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {comparison.percentChange !== 0 && (
                <>
                  {comparison.percentChange > 0 ? <TrendingUp size={14} className="inline mr-1" /> : <TrendingDown size={14} className="inline mr-1" />}
                  {Math.abs(comparison.percentChange).toFixed(1)}%
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-gray-500">Previous month: {formatCurrency(comparison.previous)}</p>
        </div>
        
        <div className="card group hover:bg-gradient-to-br hover:from-purple-50 hover:to-transparent dark:hover:from-purple-900/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/30 group-hover:scale-110 transition-transform">
              <Target className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Savings Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{savingsRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500">of your income is saved</p>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-500" size={24} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insights Sumamry</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryData.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 border border-yellow-200 dark:border-yellow-800/30">
              <p className="text-sm">💡 <strong>Spending Insight:</strong> Your highest expense is <strong className="text-yellow-700 dark:text-yellow-400">{highestCategory}</strong>. Try reducing this by 10% to save {formatCurrency(categoryData.find(c => c.name === highestCategory)?.value * 0.1 || 0)} monthly.</p>
            </div>
          )}
          
          {comparison.percentChange > 10 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800/30">
              <p className="text-sm">⚠️ <strong>Alert:</strong> Your expenses increased by {comparison.percentChange.toFixed(1)}% compared to last month. Review your recent transactions to identify the cause.</p>
            </div>
          )}
          
          {comparison.percentChange < -5 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30">
              <p className="text-sm">🎉 <strong>Excellent!</strong> You reduced your spending by {Math.abs(comparison.percentChange).toFixed(1)}% this month! Keep up the great work!</p>
            </div>
          )}
          
          {savingsRate > 20 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/30">
              <p className="text-sm">🌟 <strong>Financial Goal:</strong> You're saving {savingsRate.toFixed(1)}% of your income! This is above the recommended 20% - you're on track for financial freedom!</p>
            </div>
          )}
          
          {savingsRate < 10 && savingsRate >= 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border border-orange-200 dark:border-orange-800/30">
              <p className="text-sm">📊 <strong>Savings Tip:</strong> Your savings rate is {savingsRate.toFixed(1)}%. Try to save at least 20% of your income by reducing non-essential expenses.</p>
            </div>
          )}
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800/30">
            <p className="text-sm">📈 <strong>Pro Tip:</strong> Track your recurring expenses and consider negotiating bills or switching to cheaper alternatives for better savings.</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800/30">
            <p className="text-sm">🎯 <strong>Goal Setting:</strong> Set a monthly spending limit for {highestCategory} to better control your finances and achieve your savings goals.</p>
          </div>
        </div>
      </div>

      {categoryData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Category Breakdown</h3>
          <div className="space-y-3">
            {categoryData.sort((a, b) => b.value - a.value).map((category, index) => {
              const percentage = (category.value / totalExpenses) * 100;
              return (
                <div key={index} className="group">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                    <span className="text-gray-500">{formatCurrency(category.value)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                      style={{ 
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}cc)`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec489a', '#06b6d4', '#84cc16'];

export default Insights;