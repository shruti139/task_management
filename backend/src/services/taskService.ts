import { PrismaClient, Task } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput, QueryTasksInput } from '../utils/schemas';

const prisma = new PrismaClient();

export class TaskService {
  static async getAll(query: QueryTasksInput): Promise<Task[]> {
    const { status, priority, sortBy, order } = query;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }

    const orderBy: any = {};
    orderBy[sortBy] = order;

    return prisma.task.findMany({
      where,
      orderBy,
    });
  }

  static async getById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
    });
  }

  static async create(data: CreateTaskInput): Promise<Task> {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        status: data.status ?? 'TODO',
        priority: data.priority ?? 'MEDIUM',
        dueDate: data.dueDate ?? null,
      },
    });
  }

  static async update(id: string, data: UpdateTaskInput): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      },
    });
  }

  static async delete(id: string): Promise<Task> {
    return prisma.task.delete({
      where: { id },
    });
  }
}
