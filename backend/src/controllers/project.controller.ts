import { Role, TaskStatus } from '@prisma/client';
import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { createNotification, logActivity } from '../services/notification.service';
import { prisma } from '../utils/prisma';

const baseSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6})$/).optional(),
  dueDate: z.coerce.date().optional()
});

export const createProject = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Admin access required' });
  const parsed = baseSchema.extend({ name: z.string().min(1) }).parse(req.body);
  const project = await prisma.project.create({ data: { ...parsed, ownerId: req.user.id } });
  await prisma.projectMember.create({ data: { projectId: project.id, userId: req.user.id, role: Role.ADMIN } });
  await logActivity(req.user.id, `Created project ${project.name}`, undefined, project.id);
  return res.status(201).json({ data: project });
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  const archived = req.query.archived === 'true';
  const projects = await prisma.project.findMany({
    where: {
      isArchived: archived,
      OR: [{ ownerId: req.user!.id }, { members: { some: { userId: req.user!.id } } }]
    },
    include: { members: { include: { user: true } }, tasks: true }
  });
  const data = projects.map((p: any) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t: any) => t.status === TaskStatus.DONE).length;
    return {
      ...p,
      memberCount: p.members.length,
      taskCounts: Object.values(TaskStatus).reduce<Record<string, number>>((acc, s) => ({ ...acc, [s]: p.tasks.filter((t: any) => t.status === s).length }), {}),
      progress: total ? Math.round((done / total) * 100) : 0
    };
  });
  return res.json({ data });
};

export const getProject = async (req: AuthRequest, res: Response) => {
  const projectId = String(req.params.id);
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: { include: { user: true } }, tasks: true, activityLogs: { take: 10, orderBy: { createdAt: 'desc' } } }
  });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  return res.json({ data: project });
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const projectId = String(req.params.id);
  const parsed = baseSchema.parse(req.body);
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  const updated = await prisma.project.update({ where: { id: project.id }, data: parsed });
  await logActivity(req.user!.id, `Updated project ${project.name}`, parsed, project.id);
  return res.json({ data: updated });
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const projectId = String(req.params.id);
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  await prisma.project.delete({ where: { id: project.id } });
  return res.json({ message: 'Project deleted' });
};

export const archiveProject = async (req: AuthRequest, res: Response) => {
  const projectId = String(req.params.id);
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  const updated = await prisma.project.update({ where: { id: projectId }, data: { isArchived: !project.isArchived } });
  return res.json({ data: updated });
};

export const addMember = async (req: AuthRequest, res: Response) => {
  const projectId = String(req.params.id);
  const { email, role = Role.MEMBER } = z.object({ email: z.string().email(), role: z.nativeEnum(Role).optional() }).parse(req.body);
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const member = await prisma.projectMember.create({ data: { projectId: project.id, userId: user.id, role }, include: { user: true } });
  await createNotification(user.id, 'project_invite', 'Added to project', `You were added to ${project.name}`, `/projects/${project.id}`);
  await logActivity(req.user!.id, `Added ${user.name} to project`, { userId: user.id }, project.id);
  return res.status(201).json({ data: member });
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  const projectId = String(req.params.id);
  const userId = String(req.params.userId);
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  if (project.ownerId === userId) return res.status(400).json({ message: 'Cannot remove owner' });
  await prisma.projectMember.deleteMany({ where: { projectId: project.id, userId } });
  await logActivity(req.user!.id, 'Removed member from project', { userId }, project.id);
  return res.json({ message: 'Removed' });
};

export const updateMemberRole = async (req: AuthRequest, res: Response) => {
  const projectId = String(req.params.id);
  const userId = String(req.params.userId);
  const role = z.object({ role: z.nativeEnum(Role) }).parse(req.body).role;
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (project.ownerId === userId) return res.status(400).json({ message: 'Cannot change owner role' });
  if (project.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  const member = await prisma.projectMember.update({
    where: { projectId_userId: { projectId: project.id, userId } },
    data: { role }
  });
  return res.json({ data: member });
};

export const getMembers = async (req: AuthRequest, res: Response) => {
  const projectId = String(req.params.id);
  const data = await prisma.projectMember.findMany({ where: { projectId }, include: { user: true } });
  return res.json({ data });
};
