import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Task, ToastMessage } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const triggerToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3500);
  }, []);

  const fetchTaskDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Task not found.');
        }
        throw new Error('Failed to retrieve task details.');
      }

      const result = await response.json();
      if (result.success) {
        setTask(result.data);
      } else {
        throw new Error(result.error || 'Server error.');
      }
    } catch (err: any) {
      setError(err.message || 'Connection error.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        triggerToast('Task deleted successfully.', 'success');
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        triggerToast('Failed to delete task.', 'error');
      }
    } catch (err) {
      triggerToast('Network error during deletion.', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TODO':
        return <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">To Do</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">In Progress</span>;
      case 'DONE':
        return <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Completed</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">High Priority</span>;
      case 'MEDIUM':
        return <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Medium Priority</span>;
      case 'LOW':
        return <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">Low Priority</span>;
      default:
        return null;
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-lg text-slate-500 dark:text-slate-400">Loading task details...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 text-center">
        <div className="text-3xl text-rose-400 mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">Task Not Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">{error || 'The requested task does not exist or has been deleted.'}</p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white transition-all shadow-md">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pb-12">
      <div className="mb-6">
        <Link to="/" className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 font-semibold">
          ← Back to Dashboard
        </Link>
      </div>

      <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200">
        {/* Banner border highlight */}
        <div className={`h-1.5 w-full ${
          task.priority === 'HIGH' ? 'bg-rose-500' : task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-400 dark:bg-slate-650'
        }`} />

        <div className="p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-6 leading-tight">
            {task.title}
          </h1>

          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Description</h3>
            <div className="bg-slate-50 dark:bg-black/25 border border-slate-200 dark:border-white/5 p-5 rounded-2xl text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {task.description || <span className="italic opacity-55">No description provided.</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-slate-200 dark:border-white/5 pt-6">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">📅 Due Date</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{formatDate(task.dueDate)}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">🕒 Created At</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{formatTimestamp(task.createdAt)}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">🔄 Last Updated</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{formatTimestamp(task.updatedAt)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-white/5 pt-6">
            <button 
              className="px-5 py-2.5 rounded-xl border border-rose-500/20 hover:border-rose-500 text-rose-500 dark:text-rose-400 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 text-sm font-semibold transition-all cursor-pointer"
              onClick={handleDelete}
            >
              🗑️ Delete Task
            </button>
            <Link 
              to={`/tasks/${task.id}/edit`}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/20 text-center"
            >
              ✏️ Edit Task
            </Link>
          </div>
        </div>
      </article>

      {/* Toast Notification Feed */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-xl p-4 flex items-center gap-3 min-w-[280px] animate-[slideInRight_0.25s_cubic-bezier(0.4,0,0.2,1)] border-l-4 ${
              toast.type === 'success' ? 'border-l-emerald-500' : toast.type === 'error' ? 'border-l-rose-500' : 'border-l-indigo-500'
            }`}
          >
            <span className={`text-base font-semibold ${
              toast.type === 'success' ? 'text-emerald-500 dark:text-emerald-400' : toast.type === 'error' ? 'text-rose-500 dark:text-rose-400' : 'text-indigo-500 dark:text-indigo-400'
            }`}>
              {toast.type === 'success' ? '✔' : toast.type === 'error' ? '❌' : 'ℹ'}
            </span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDetailPage;
