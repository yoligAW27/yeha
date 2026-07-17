import React from 'react';
import { FaHome, FaUser, FaBrain, FaPlus, FaHistory, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = ({ currentPage, setCurrentPage, onLogout, darkMode, toggleDarkMode }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'new-request', label: 'New Request', icon: FaPlus },
    { id: 'history', label: 'History', icon: FaHistory },
  ];

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container-custom py-3 sm:py-4">
        <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-serif">የሐ</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 hidden sm:block">
              Yeha
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={16} className="sm:size-[18px]" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}

            {/* Study Session Button - More Prominent */}
            <button
              onClick={() => setCurrentPage('study-session')}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] ${
                currentPage === 'study-session'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50'
              }`}
            >
              <FaBrain size={16} className="sm:size-[18px]" />
              <span className="hidden sm:inline">Study Session</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {darkMode ? <FaSun size={16} className="sm:size-[18px]" /> : <FaMoon size={16} className="sm:size-[18px]" />}
              <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <FaSignOutAlt size={16} className="sm:size-[18px]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;