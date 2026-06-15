import React from 'react';
import { Link } from 'react-router-dom';
import type { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, nextStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onStatusChange,
}) => {
  const { id, title, description, status, priority, dueDate } = task;

  const isOverdue = () => {
    if (!dueDate || status === 'DONE') return false;
    const due = new Date(dueDate);
    const now = new Date();
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return due < now;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getPriorityClass = () => {
    switch (priority) {
      case 'HIGH':
        return 'before:bg-rose-500';
      case 'MEDIUM':
        return 'before:bg-amber-500';
      case 'LOW':
        return 'before:bg-slate-400 dark:before:bg-slate-600';
      default:
        return '';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'TODO':
        return <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">To Do</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">In Progress</span>;
      case 'DONE':
        return <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Completed</span>;
    }
  };

  const getPriorityBadge = () => {
    switch (priority) {
      case 'HIGH':
        return <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">High</span>;
      case 'MEDIUM':
        return <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Medium</span>;
      case 'LOW':
        return <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">Low</span>;
    }
  };

  const handleQuickStatus = () => {
    if (status === 'TODO') {
      onStatusChange(id, 'IN_PROGRESS');
    } else if (status === 'IN_PROGRESS') {
      onStatusChange(id, 'DONE');
    } else {
      onStatusChange(id, 'TODO');
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 hover:shadow-xl relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:transition-all before:duration-300 ${getPriorityClass()}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1.5">
          <Link 
            to={`/tasks/${id}`} 
            className={`text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${status === 'DONE' ? 'line-through text-slate-400 dark:text-slate-600' : ''}`}
          >
            {title}
          </Link>
          <div className="flex gap-1.5 mt-1">
            {getStatusBadge()}
            {getPriorityBadge()}
          </div>
        </div>
        
        {/* Quick status toggle button */}
        <button 
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-150 flex items-center justify-center text-sm cursor-pointer" 
          onClick={handleQuickStatus}
          title={status === 'DONE' ? 'Mark as Todo' : status === 'TODO' ? 'Start Task' : 'Complete Task'}
        >
          {status === 'DONE' ? '🔄' : status === 'TODO' ? '▶️' : '✅'}
        </button>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 min-h-[4.5rem]">
        {description || <span className="italic opacity-60">No description provided.</span>}
      </p>

      <div className="flex justify-between items-center border-t border-slate-200 dark:border-white/5 pt-4 mt-2">
        <div className={`flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ${isOverdue() ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}`}>
          📅 {isOverdue() ? 'Overdue: ' : ''}{formatDate(dueDate)}
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/tasks/${id}/edit`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-150 flex items-center justify-center text-sm" 
            title="Edit Task"
          >
            ✏️
          </Link>
          <button 
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 transition-all duration-150 flex items-center justify-center text-sm cursor-pointer" 
            onClick={() => onDelete(id)}
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
