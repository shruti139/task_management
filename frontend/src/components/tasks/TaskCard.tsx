import React from 'react';
import { Link } from 'react-router-dom';
import type { Task, TaskStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/date';

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
            <Badge type="status" value={status} size="sm" />
            <Badge type="priority" value={priority} size="sm" />
          </div>
        </div>
        
        {/* Quick status toggle button */}
        <Button 
          variant="ghost"
          size="icon"
          onClick={handleQuickStatus}
          title={status === 'DONE' ? 'Mark as Todo' : status === 'TODO' ? 'Start Task' : 'Complete Task'}
        >
          {status === 'DONE' ? '🔄' : status === 'TODO' ? '▶️' : '✅'}
        </Button>
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
            title="Edit Task"
          >
            <Button variant="ghost" size="icon">
              ✏️
            </Button>
          </Link>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            title="Delete Task"
            className="hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/10"
          >
            🗑️
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
