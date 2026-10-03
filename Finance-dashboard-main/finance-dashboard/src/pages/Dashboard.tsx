// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, Sparkles } from 'lucide-react';
import SummaryCard from '../components/dashboard/SummaryCard';
import QuickActions from '../components/dashboard/QuickActions';
import { getTotalBalance, getTotalIncome, getTotalExpenses, getMonthlyData, getCategoryData, formatCurrency } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart, Legend } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec489a', '#06b6d4', '#84cc16'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, role, showNotification } = useStore();
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [animateCards, setAnimateCards] = useState(false);
  
  const totalBalance = getTotalBalance(transactions);
  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const monthlyData = getMonthlyData(transactions);
  const categoryData = getCategoryData(transactions);
  
  useEffect(() => {
    setAnimateCards(true);
  }, []);
  
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  const handleExport = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvData = transactions.map(t => [t.date, t.description, t.category, t.type, t.amount]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
  };

  const renderChart = () => {
    if (monthlyData.length === 0) return null;
    
    switch(chartType) {
      case 'line':
        return (
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value}`} />
            <Tooltip 
                               formatter={(value) => {
                    if (value === undefined || value === null) return '';
                    return formatCurrency(Number(value));
                  }}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}

            />
            <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 6 }} activeDot={{ r: 8 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value}`} />
            <Tooltip formatter={(value) => {
                    if (value === undefined || value === null) return '';
                    return formatCurrency(Number(value));
                  }}
 />
            <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
          </AreaChart>
        );
      default:
        return (
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value}`} />
            <Tooltip formatter={(value) => {
                    if (value === undefined || value === null) return '';
                    return formatCurrency(Number(value));
                  }}
 />
            <Bar dataKey="balance" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} />
            <span className="text-sm font-medium">Welcome Back!</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-primary-100">Track your finances and achieve your goals</p>
        </div>
      </div>
    
      <QuickActions 
        onAddTransaction={() => navigate('/transactions')}
        onExport={handleExport}
        onViewInsights={() => navigate('/insights')}
        role={role}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`transform transition-all duration-500 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '0ms' }}>
          <SummaryCard title="Total Balance" amount={totalBalance} icon={Wallet} color="primary" trend={5.2} />
        </div>
        <div className={`transform transition-all duration-500 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
          <SummaryCard title="Total Income" amount={totalIncome} icon={TrendingUp} color="green" trend={8.1} />
        </div>
        <div className={`transform transition-all duration-500 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
          <SummaryCard title="Total Expenses" amount={totalExpenses} icon={TrendingDown} color="red" trend={-3.4} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Balance Trend</h3>
            <div className="flex gap-2">
              {(['line', 'area', 'bar'] as const).map((type) => (
                <button 
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize transition-all ${chartType === type ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                 label={({ name, percent }) => {
                    const pct = percent ?? 0;
                    return `${name} ${(pct * 100).toFixed(0)}%`;
                  }}

                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={5}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => {
                    if (value === undefined || value === null) return '';
                    return formatCurrency(Number(value));
                  }}
 />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">No expense data available</div>
          )}
        </div>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <button onClick={() => navigate('/transactions')} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </button>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map((t, index) => (
              <div key={t.id} className="table-row flex items-center justify-between p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {t.type === 'income' ? <TrendingUp size={18} className="text-green-600" /> : <TrendingDown size={18} className="text-red-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t.description}</p>
                    <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                  </div>
                </div>
                <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No transactions yet. Add your first transaction!</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;