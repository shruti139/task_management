import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Task, TaskStatus, TaskPriority, ToastMessage } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

export const TaskFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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

  // Fetch task if in Edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) {
          throw new Error('Failed to retrieve task details.');
        }
        const result = await response.json();
        if (result.success) {
          const task: Task = result.data;
          setTitle(task.title);
          setDescription(task.description || '');
          setStatus(task.status);
          setPriority(task.priority);
          if (task.dueDate) {
            setDueDate(task.dueDate.split('T')[0]);
          } else {
            setDueDate('');
          }
        } else {
          throw new Error(result.error || 'Server error.');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading task data.');
        triggerToast('Could not load task data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, isEditMode, triggerToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (title.length > 200) {
      setError('Title cannot exceed 200 characters.');
      return;
    }

    if (description.length > 2000) {
      setError('Description cannot exceed 2000 characters.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    try {
      const url = isEditMode ? `${API_BASE_URL}/${id}` : API_BASE_URL;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        triggerToast(isEditMode ? 'Task updated successfully!' : 'Task created successfully!', 'success');
        // Wait a brief moment for user to see the success toast before redirecting
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        const errorMsg = result.errors ? result.errors.map((e: any) => e.message).join(', ') : result.error;
        setError(errorMsg || 'Failed to save task.');
        triggerToast('Failed to save task.', 'error');
      }
    } catch (err) {
      setError('Network connection error.');
      triggerToast('Network error during save.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="text-lg text-slate-500 dark:text-slate-400">Loading task details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 pb-12">
      <div className="mb-6">
        <Link to="/" className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 font-semibold">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-indigo-500/5 overflow-hidden transition-colors duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && (
              <div className="text-rose-600 dark:text-rose-400 mb-4 text-sm font-semibold flex items-center gap-1">
                ⚠️ {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-title">
                Title *
              </label>
              <input
                id="task-title"
                type="text"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-desc">
                Description
              </label>
              <textarea
                id="task-desc"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 resize-y min-h-[120px]"
                placeholder="Enter detailed description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-status">
                  Status
                </label>
                <div className="relative">
                  <select
                    id="task-status"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer appearance-none"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Completed</option>
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 pointer-events-none">▼</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-priority">
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="task-priority"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer appearance-none"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 pointer-events-none">▼</span>
                </div>
              </div>
            </div>

            <div className="mb-2 mt-4">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-duedate">
                Due Date
              </label>
              <div className="relative">
                {/* Visible display input forcing DD-MM-YYYY */}
                <input
                  type="text"
                  readOnly
                  placeholder="DD-MM-YYYY"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer pr-10"
                  value={dueDate ? dueDate.split('-').reverse().join('-') : ''}
                />
                {/* Calendar Icon Indicator overlay */}
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">📅</span>
                
                {/* Invisible native input date field positioned exactly on top */}
                <input
                  id="task-duedate"
                  type="date"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={isEditMode ? undefined : new Date().toISOString().split('T')[0]}
                  onClick={(e) => {
                    try {
                      (e.target as any).showPicker();
                    } catch (err) {}
                  }}
                  onFocus={(e) => {
                    try {
                      (e.target as any).showPicker();
                    } catch (err) {}
                  }}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3 bg-slate-50 dark:bg-black/10">
            <Link to="/" className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-sm font-semibold text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:text-slate-200 transition-all flex items-center justify-center">
              Cancel
            </Link>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>

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

export default TaskFormPage;
