import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { NotFoundError } from '../utils/errors';

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
      const task = await TaskService.getById(id);
      if (!task) {
        throw new NotFoundError(`Task with ID ${id} not found.`);
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
    try {
      const { id } = req.params;
      const task = await TaskService.update(id, req.body);
      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await TaskService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
