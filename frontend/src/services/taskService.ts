import type { Task, TaskFilters, TaskStatus, TaskPriority } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

export interface TaskPayload {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}

export const taskService = {
  async getAll(filters: Partial<TaskFilters> = {}): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to retrieve task data.');
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to retrieve task data.');
    }
    return result.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Task not found.');
      }
      throw new Error('Failed to retrieve task details.');
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to retrieve task details.');
    }
    return result.data;
  },

  async create(payload: TaskPayload): Promise<Task> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      const errorMsg = result.errors ? result.errors.map((e: any) => e.message).join(', ') : result.error;
      throw new Error(errorMsg || 'Failed to create task.');
    }
    return result.data;
  },

  async update(id: string, payload: Partial<TaskPayload>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      const errorMsg = result.errors ? result.errors.map((e: any) => e.message).join(', ') : result.error;
      throw new Error(errorMsg || 'Failed to update task.');
    }
    return result.data;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task.');
    }
  },
};

export default taskService;
