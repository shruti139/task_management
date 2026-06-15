import { z } from 'zod';

// Define enums matching Prisma schema
export const TaskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
export const TaskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

// Preprocess helper to convert string date inputs into Date objects
const datePreprocess = z.preprocess((val) => {
  if (typeof val === 'string' && val.trim() !== '') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return val === null ? null : undefined;
}, z.date().nullable().optional());

export const CreateTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .nullable()
    .optional(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  dueDate: datePreprocess,
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  description: z
    .string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .nullable()
    .optional(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  dueDate: datePreprocess,
});

export const QueryTasksSchema = z.object({
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  sortBy: z.enum(['createdAt', 'dueDate']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type QueryTasksInput = z.infer<typeof QueryTasksSchema>;
