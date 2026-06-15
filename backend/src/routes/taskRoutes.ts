import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import { CreateTaskSchema, UpdateTaskSchema, QueryTasksSchema, ParamsIdSchema } from '../utils/schemas';

const router = Router();

router.get('/', validateQuery(QueryTasksSchema), TaskController.listTasks);
router.get('/:id', validateParams(ParamsIdSchema), TaskController.getTaskById);
router.post('/', validateBody(CreateTaskSchema), TaskController.createTask);
router.put('/:id', validateParams(ParamsIdSchema), validateBody(UpdateTaskSchema), TaskController.updateTask);
router.delete('/:id', validateParams(ParamsIdSchema), TaskController.deleteTask);

export default router;
