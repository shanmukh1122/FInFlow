// src/components/dashboard/SummaryCard.tsx
import React, { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: string;
  trend?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon: Icon, color, trend }) => {
  const [displayAmount, setDisplayAmount] = useState(0);
  
  useEffect(() => {
    // Animate counter
    const duration = 1000;
    const steps = 60;
    const increment = amount / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplayAmount(amount);
        clearInterval(timer);
      } else {
        setDisplayAmount(current);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [amount]);
  
  return (
    <div className="card stat-card group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            {formatCurrency(displayAmount)}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br from-${color}-100 to-${color}-50 dark:from-${color}-900/30 dark:to-${color}-800/30 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`text-${color}-600 dark:text-${color}-400`} size={28} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;