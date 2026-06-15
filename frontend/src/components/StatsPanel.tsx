import React from 'react';
import type { Task } from '../types';

interface StatsPanelProps {
  tasks: Task[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ tasks }) => {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'TODO').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const done = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">📋</div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{total}</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Tasks</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">⭕</div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{todo}</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">To Do</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">⚡</div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{inProgress}</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In Progress</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">✅</div>
        <div className="flex flex-col">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{done}</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
        </div>
      </div>
    </div>
  );
};
