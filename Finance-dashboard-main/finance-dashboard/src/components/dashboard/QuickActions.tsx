// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { PlusCircle, Download, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onAddTransaction: () => void;
  onExport: () => void;
  onViewInsights: () => void;
  role: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddTransaction, onExport, onViewInsights, role }) => {
  const actions = [
    { icon: PlusCircle, label: 'Add Transaction', onClick: onAddTransaction, color: 'primary', show: role === 'admin' },
    { icon: Download, label: 'Export Data', onClick: onExport, color: 'green', show: true },
    { icon: TrendingUp, label: 'View Insights', onClick: onViewInsights, color: 'purple', show: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.filter(action => action.show).map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 p-4 text-white transition-all hover:shadow-xl hover:-translate-y-1`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <action.icon className="mb-2" size={24} />
          <p className="text-sm font-medium">{action.label}</p>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;