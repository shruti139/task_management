import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 px-6 py-4 mb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent hover:opacity-90 transition-all">
          FlowTask
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors">
            Dashboard
          </Link>
          
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-sm transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link to="/tasks/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm hover:shadow-indigo-500/10 cursor-pointer">
            ➕ New Task
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
