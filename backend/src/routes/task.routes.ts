import { Router } from 'express';
import {
  addComment,
  bulkUpdateTasks,
  createTask,
  deleteComment,
  deleteTask,
  getComments,
  getOverdueTasks,
  getTask,
  getTasks,
  updateTask,
  updateTaskStatus
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', getTasks);
router.post('/', createTask);
router.get('/overdue', getOverdueTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);
router.post('/bulk-update', bulkUpdateTasks);
router.get('/:id/comments', getComments);
router.post('/:id/comments', addComment);
router.delete('/:taskId/comments/:commentId', deleteComment);

export default router;
