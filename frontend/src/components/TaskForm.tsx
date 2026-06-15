import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../types';

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
  }) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
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
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setDueDate('');
    }
    setError('');
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-[550px] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-100">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button className="text-slate-400 hover:text-slate-100 text-2xl leading-none cursor-pointer" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && (
              <div className="text-rose-400 mb-4 text-sm font-semibold flex items-center gap-1">
                ⚠️ {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-title">
                Title *
              </label>
              <input
                id="task-title"
                type="text"
                className="w-full px-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-desc">
                Description
              </label>
              <textarea
                id="task-desc"
                className="w-full px-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 resize-y min-h-[120px]"
                placeholder="Enter detailed description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-status">
                  Status
                </label>
                <select
                  id="task-status"
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-priority">
                  Priority
                </label>
                <select
                  id="task-priority"
                  className="w-full px-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="mb-2 mt-4">
              <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider" htmlFor="task-duedate">
                Due Date
              </label>
              <input
                id="task-duedate"
                type="date"
                className="w-full px-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3 bg-black/10">
            <button type="button" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-slate-200 border border-white/5 transition-all cursor-pointer" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
