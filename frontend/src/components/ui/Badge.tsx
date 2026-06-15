import React from 'react';
import type { TaskStatus, TaskPriority } from '../../types';

export type BadgeType = 'status' | 'priority';

interface BadgeProps {
  type: BadgeType;
  value: TaskStatus | TaskPriority;
  size?: 'sm' | 'md';
  showLabelSuffix?: boolean; // Appends "Priority" to the label if type is priority
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  value,
  size = 'sm',
  showLabelSuffix = false,
}) => {
  const isStatus = type === 'status';
  
  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2.5 py-0.5' 
    : 'text-xs px-3 py-1';

  let label = '';
  let colorClasses = '';

  if (isStatus) {
    switch (value as TaskStatus) {
      case 'TODO':
        label = 'To Do';
        colorClasses = 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10';
        break;
      case 'IN_PROGRESS':
        label = 'In Progress';
        colorClasses = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
        break;
      case 'DONE':
        label = 'Completed';
        colorClasses = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        break;
      default:
        label = String(value);
        colorClasses = 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10';
    }
  } else {
    switch (value as TaskPriority) {
      case 'HIGH':
        label = showLabelSuffix ? 'High Priority' : 'High';
        colorClasses = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
        break;
      case 'MEDIUM':
        label = showLabelSuffix ? 'Medium Priority' : 'Medium';
        colorClasses = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
        break;
      case 'LOW':
        label = showLabelSuffix ? 'Low Priority' : 'Low';
        colorClasses = 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10';
        break;
      default:
        label = String(value);
        colorClasses = 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10';
    }
  }

  return (
    <span className={`inline-flex items-center font-bold rounded-full uppercase tracking-wider border ${sizeClasses} ${colorClasses}`}>
      {label}
    </span>
  );
};

export default Badge;
