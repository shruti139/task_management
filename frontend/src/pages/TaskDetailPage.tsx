import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Task } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { taskService } from '../services/taskService';
import { formatDate, formatTimestamp } from '../utils/date';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchTaskDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getById(id);
      setTask(data);
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
    if (!id || !window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.delete(id);
      showToast('Task deleted successfully.', 'success');
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete task.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving task details..." />;
  }

  if (error || !task) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 text-center">
        <div className="text-3xl text-rose-400 mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">Task Not Found</h3>
        <p className="text-sm text-slate-555 dark:text-slate-400 mt-2 mb-6">{error || 'The requested task does not exist or has been deleted.'}</p>
        <Link to="/" className="inline-flex justify-center">
          <Button variant="primary" size="md">
            Return to Dashboard
          </Button>
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
            <Badge type="status" value={task.status} size="md" />
            <Badge type="priority" value={task.priority} size="md" showLabelSuffix={true} />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-6 leading-tight">
            {task.title}
          </h1>

          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Description</h3>
            <div className="bg-slate-55 dark:bg-black/25 border border-slate-200 dark:border-white/5 p-5 rounded-2xl text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
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
            <Button 
              variant="danger-outline"
              onClick={handleDelete}
            >
              🗑️ Delete Task
            </Button>
            <Link to={`/tasks/${task.id}/edit`}>
              <Button variant="primary">
                ✏️ Edit Task
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default TaskDetailPage;
