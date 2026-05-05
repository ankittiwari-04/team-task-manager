import { Router } from 'express';
import {
  addMember,
  archiveProject,
  createProject,
  deleteProject,
  getMembers,
  getProject,
  getProjects,
  removeMember,
  updateMemberRole,
  updateProject
} from '../controllers/project.controller';
import { authenticate, requireAdmin, requireProjectAccess } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', getProjects);
router.post('/', requireAdmin, createProject);
router.get('/:id', requireProjectAccess, getProject);
router.put('/:id', requireProjectAccess, updateProject);
router.delete('/:id', requireProjectAccess, deleteProject);
router.patch('/:id/archive', requireProjectAccess, archiveProject);
router.get('/:id/members', requireProjectAccess, getMembers);
router.post('/:id/members', requireProjectAccess, addMember);
router.delete('/:id/members/:userId', requireProjectAccess, removeMember);
router.patch('/:id/members/:userId/role', requireProjectAccess, updateMemberRole);

export default router;
