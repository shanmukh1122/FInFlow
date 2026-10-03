// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import  type { Role } from '../../types';
import { Moon, Sun, UserCog, Eye, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { role, setRole, darkMode, toggleDarkMode } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
    } border-b border-gray-200/50 dark:border-gray-700/50`}>
      <div className="px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onMenuClick}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors lg:hidden"
              aria-label="Menu"
            >
              <Menu size={isMobile ? 18 : 20} />
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base sm:text-lg md:text-xl">$</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Finance Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Track your finances smartly</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

            <div className="flex items-center gap-1 sm:gap-2 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-0.5 sm:p-1">
              <button
                onClick={() => setRole('viewer')}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg transition-all text-xs sm:text-sm ${
                  role === 'viewer'
                    ? 'bg-white dark:bg-gray-600 shadow-md text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Eye size={isMobile ? 14 : 16} />
                <span className="hidden sm:inline"><b>Viewer</b></span>
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg transition-all text-xs sm:text-sm ${
                  role === 'admin'
                    ? 'bg-white dark:bg-gray-600 shadow-md text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <UserCog size={isMobile ? 14 : 16} />
                <span className="hidden sm:inline"><b>Admin</b></span>
              </button>
            </div>
            
            <button className="hidden sm:block p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative">
              <Bell size={isMobile ? 16 : 18} />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun size={isMobile ? 16 : 18} /> : <Moon size={isMobile ? 16 : 18} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;