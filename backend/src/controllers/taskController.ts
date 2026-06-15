import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[45][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

export class TaskController {
  static async listTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await TaskService.getAll(req.query as any);
      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!isValidUUID(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID format. Must be a valid UUID.',
        });
        return;
      }

      const task = await TaskService.getById(id);
      if (!task) {
        res.status(404).json({
          success: false,
          error: `Task with ID ${id} not found.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await TaskService.create(req.body);
      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    try {
      if (!isValidUUID(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID format. Must be a valid UUID.',
        });
        return;
      }

      const task = await TaskService.update(id, req.body);
      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error: any) {
      // Prisma error code for Record not found
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          error: `Task with ID ${id} not found.`,
        });
        return;
      }
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    try {
      if (!isValidUUID(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID format. Must be a valid UUID.',
        });
        return;
      }

      await TaskService.delete(id);
      res.status(204).send(); // No Content on successful deletion
    } catch (error: any) {
      // Prisma error code for Record not found
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          error: `Task with ID ${id} not found.`,
        });
        return;
      }
      next(error);
    }
  }
}
