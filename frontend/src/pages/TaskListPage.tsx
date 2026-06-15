import React, { useState, useEffect, useCallback } from 'react';
import type { Task, TaskFilters, TaskStatus } from '../types';
import { StatsPanel } from '../components/tasks/StatsPanel';
import { TaskCard } from '../components/tasks/TaskCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { taskService } from '../services/taskService';

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
  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAll(filters);
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Could not connect to the server.');
      showToast('Error loading tasks from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (id: string, nextStatus: TaskStatus) => {
    try {
      const updatedTask = await taskService.update(id, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      showToast(`Task moved to ${nextStatus.replace('_', ' ')}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to change status.', 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task deleted successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete task.', 'error');
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
          <Input
            type="text"
            className="pl-10"
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select
            className="w-full sm:w-auto"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as any }))}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'TODO', label: 'To Do' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'DONE', label: 'Completed' },
            ]}
          />

          <Select
            className="w-full sm:w-auto"
            value={filters.priority}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value as any }))}
            options={[
              { value: '', label: 'All Priorities' },
              { value: 'LOW', label: 'Low Priority' },
              { value: 'MEDIUM', label: 'Medium Priority' },
              { value: 'HIGH', label: 'High Priority' },
            ]}
          />

          <Select
            className="w-full sm:w-auto"
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            options={[
              { value: 'createdAt', label: 'Date Created' },
              { value: 'dueDate', label: 'Due Date' },
            ]}
          />

          <Button
            variant="secondary"
            className="px-4 py-2.5"
            title={filters.order === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            onClick={() => setFilters((prev) => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))}
          >
            {filters.order === 'asc' ? '⬆️' : '⬇️'}
          </Button>
        </div>
      </section>

      {/* Main Task Feed */}
      {loading && tasks.length === 0 ? (
        <LoadingSpinner />
      ) : error && tasks.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-900/40 border border-dashed border-rose-500/20 rounded-2xl flex flex-col items-center gap-4">
          <div className="text-3xl text-rose-500">⚠️</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">Failed to Load Data</h3>
          <p className="text-sm text-slate-550 dark:text-slate-400 max-w-sm">{error}</p>
          <Button variant="secondary" onClick={fetchTasks}>
            Retry Connection
          </Button>
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
                <Button
                  variant="secondary"
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
                </Button>
              )}
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default TaskListPage;
