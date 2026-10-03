// src/components/layout/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Target, 
  BarChart3, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  PieChart,
  Gift,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/helpers';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { transactions } = useStore();
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'primary' },
    { path: '/transactions', icon: Receipt, label: 'Transactions', color: 'blue' },
    { path: '/insights', icon: TrendingUp, label: 'Insights', color: 'purple' },
    { path: '/budgets', icon: Target, label: 'Budgets', color: 'green' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'orange' },
    { path: '/reports', icon: FileText, label: 'Reports', color: 'red' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'gray' },
  ];

  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  const sidebarContent = (
    <>
      {isMobile && onClose && (
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}
      
      {!isCollapsed ? (
        <div className={`mb-4 md:mb-8 text-center ${isMobile ? 'mt-2' : ''}`}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
            <span className="text-white font-bold text-lg md:text-xl">$</span>
          </div>
          <h2 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">Finance Pro</h2>
          <p className="text-xs text-gray-500 hidden md:block">Track. Save. Grow.</p>
        </div>
      ) : (
        <div className="mb-4 md:mb-8 text-center">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg md:rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white font-bold text-base md:text-lg">$</span>
          </div>
        </div>
      )}


      <div className="space-y-0.5 md:space-y-1">
        <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${isCollapsed ? 'text-center' : 'px-3'} hidden md:block`}>
          {!isCollapsed ? 'Main Menu' : '•••'}
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? `bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400 font-medium`
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={isCollapsed ? 18 : 20} />
            {!isCollapsed && <span className="text-sm md:text-base">{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden md:block">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </div>
      
      {!isCollapsed && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3 hidden md:block">
            Quick Stats
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="p-1 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Wallet size={12} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-xs md:text-sm font-semibold truncate">{formatCurrency(totalBalance)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <PieChart size={12} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Categories</p>
                <p className="text-xs md:text-sm font-semibold">7 Active</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
     
    </>
  );


  if (isMobile) {
    return (
      <div className="w-64 h-full bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
        {sidebarContent}
      </div>
    );
  }


  return (
    <aside 
      className={`sticky top-0 h-screen bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${
        isCollapsed ? 'w-16 md:w-20' : 'w-56 md:w-64'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md z-10 hidden md:block"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
      
      <div className="p-3 md:p-4 overflow-y-auto h-full">
        {sidebarContent}
      </div>
    </aside>
  );
};

export default Sidebar;