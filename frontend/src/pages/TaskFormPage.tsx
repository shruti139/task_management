import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { taskService } from '../services/taskService';

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
  const { showToast } = useToast();

  // Fetch task if in Edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const task: Task = await taskService.getById(id);
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status);
        setPriority(task.priority);
        if (task.dueDate) {
          setDueDate(task.dueDate.split('T')[0]);
        } else {
          setDueDate('');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading task data.');
        showToast('Could not load task data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, isEditMode, showToast]);

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
      if (isEditMode) {
        await taskService.update(id, payload);
        showToast('Task updated successfully!', 'success');
      } else {
        await taskService.create(payload);
        showToast('Task created successfully!', 'success');
      }
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to save task.');
      showToast(err.message || 'Failed to save task.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving task details..." />;
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
              <Label htmlFor="task-title" required>
                Title
              </Label>
              <Input
                id="task-title"
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="task-desc">
                Description
              </Label>
              <Textarea
                id="task-desc"
                placeholder="Enter detailed description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-status">
                  Status
                </Label>
                <Select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  options={[
                    { value: 'TODO', label: 'To Do' },
                    { value: 'IN_PROGRESS', label: 'In Progress' },
                    { value: 'DONE', label: 'Completed' },
                  ]}
                />
              </div>

              <div>
                <Label htmlFor="task-priority">
                  Priority
                </Label>
                <Select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  options={[
                    { value: 'LOW', label: 'Low' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HIGH', label: 'High' },
                  ]}
                />
              </div>
            </div>

            <div className="mb-2 mt-4">
              <Label htmlFor="task-duedate">
                Due Date
              </Label>
              <div className="relative">
                {/* Visible display input forcing DD-MM-YYYY */}
                <Input
                  type="text"
                  readOnly
                  placeholder="DD-MM-YYYY"
                  className="cursor-pointer pr-10"
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

          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3 bg-slate-55 dark:bg-black/10">
            <Link to="/">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              variant="primary"
              isLoading={saving}
              disabled={saving}
            >
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormPage;
