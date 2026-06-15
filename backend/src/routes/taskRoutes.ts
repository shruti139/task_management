import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateBody, validateQuery } from '../middleware/validate';
import { CreateTaskSchema, UpdateTaskSchema, QueryTasksSchema } from '../utils/schemas';

const router = Router();

router.get('/', validateQuery(QueryTasksSchema), TaskController.listTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', validateBody(CreateTaskSchema), TaskController.createTask);
router.put('/:id', validateBody(UpdateTaskSchema), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;
