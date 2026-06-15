import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

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
          <Button
            onClick={onToggleTheme}
            variant="secondary"
            size="icon"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>

          <Link to="/tasks/new">
            <Button variant="primary" size="xs">
              ➕ New Task
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
