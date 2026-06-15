import React, { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../../types';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

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
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-100 text-2xl leading-none">
            &times;
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && (
              <div className="text-rose-400 mb-4 text-sm font-semibold flex items-center gap-1">
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
              <Input
                id="task-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3 bg-black/10">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
