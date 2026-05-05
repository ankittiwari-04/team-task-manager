import { Router } from 'express';
import { getAllUsers, getUserById, searchUsers } from '../controllers/user.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/search', searchUsers);
router.get('/', requireAdmin, getAllUsers);
router.get('/:id', getUserById);

export default router;
