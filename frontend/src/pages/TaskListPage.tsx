import React, { useState, useEffect, useCallback } from 'react';
import type { Task, TaskFilters, TaskStatus, ToastMessage } from '../types';
import { StatsPanel } from '../components/StatsPanel';
import { TaskCard } from '../components/TaskCard';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

export const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc',
    search: '',
  });
  const [loading, setLoading] = useState(false);
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

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      params.append('sortBy', filters.sortBy);
      params.append('order', filters.order);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks.');
      }
      
      const result = await response.json();
      if (result.success) {
        setTasks(result.data);
      } else {
        throw new Error(result.error || 'Server error occurred.');
      }
    } catch (err: any) {
      setError(err.message || 'Could not connect to the server.');
      triggerToast('Error loading tasks from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, filters.sortBy, filters.order, triggerToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (id: string, nextStatus: TaskStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? result.data : t))
        );
        triggerToast(`Task moved to ${nextStatus.replace('_', ' ')}`, 'info');
      } else {
        triggerToast('Failed to change status.', 'error');
      }
    } catch (err) {
      triggerToast('Network error during status update.', 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        triggerToast('Task deleted successfully.', 'success');
      } else {
        triggerToast('Failed to delete task.', 'error');
      }
    } catch (err) {
      triggerToast('Network error during deletion.', 'error');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const searchLower = filters.search.toLowerCase().trim();
    if (!searchLower) return true;
    return (
      t.title.toLowerCase().includes(searchLower) ||
      (t.description && t.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      {/* Dashboard Stats */}
      <StatsPanel tasks={tasks} />

      {/* Filter and Sort controls */}
      <section className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8 shadow-md transition-colors duration-200">
        <div className="relative flex-1 min-w-[260px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">🔍</span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <select
              className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-slate-55 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as any }))}
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Completed</option>
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 pointer-events-none">▼</span>
          </div>

          <div className="relative">
            <select
              className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-slate-55 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as any }))}
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 pointer-events-none">▼</span>
          </div>

          <div className="relative">
            <select
              className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-slate-55 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-slate-500 pointer-events-none">▼</span>
          </div>

          <button
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center"
            title={filters.order === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            onClick={() => setFilters((prev) => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))}
          >
            {filters.order === 'asc' ? '⬆️' : '⬇️'}
          </button>
        </div>
      </section>

      {/* Main Task Feed */}
      {loading && tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-lg text-slate-500 dark:text-slate-400">Loading task database...</div>
        </div>
      ) : error && tasks.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-900/40 border border-dashed border-rose-500/20 rounded-2xl flex flex-col items-center gap-4">
          <div className="text-3xl text-rose-500">⚠️</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">Failed to Load Data</h3>
          <p className="text-sm text-slate-550 dark:text-slate-400 max-w-sm">{error}</p>
          <button className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer" onClick={fetchTasks}>
            Retry Connection
          </button>
        </div>
      ) : (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 px-6 bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center gap-4">
              <div className="text-3xl text-slate-400 dark:text-slate-500 opacity-60">📁</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">No tasks found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Try clearing filters or search criteria, or create a brand new task to get started.</p>
              {(filters.status || filters.priority || filters.search) && (
                <button
                  className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                  onClick={() =>
                    setFilters({
                      status: '',
                      priority: '',
                      sortBy: 'createdAt',
                      order: 'desc',
                      search: '',
                    })
                  }
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </main>
      )}

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

export default TaskListPage;
