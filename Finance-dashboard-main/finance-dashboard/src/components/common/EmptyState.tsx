// src/components/common/EmptyState.tsx
import React from 'react';
import { Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  showAddButton?: boolean;
  onAdd?: () => void;
  role?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, showAddButton, onAdd, role }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Inbox size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{message}</p>
      {showAddButton && role === 'admin' && onAdd && (
        <button onClick={onAdd} className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} />
          Add Your First Transaction
        </button>
      )}
    </div>
  );
};

export default EmptyState;