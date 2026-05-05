import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { createNotification, logActivity } from '../services/notification.service';
import { prisma } from '../utils/prisma';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  projectId: z.string()
});

const canAdminProject = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return false;
  if (project.ownerId === userId) return true;
  const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId, userId } } });
  return member?.role === 'ADMIN';
};

const asStatus = (value: unknown) => (typeof value === 'string' && Object.values(TaskStatus).includes(value as TaskStatus) ? (value as TaskStatus) : undefined);
const asPriority = (value: unknown) => (typeof value === 'string' && Object.values(TaskPriority).includes(value as TaskPriority) ? (value as TaskPriority) : undefined);

export const createTask = async (req: AuthRequest, res: Response) => {
  const parsed = taskSchema.parse(req.body);
  const task = await prisma.task.create({
    data: { ...parsed, creatorId: req.user!.id, tags: parsed.tags ?? [] },
    include: { assignee: true, creator: true }
  });
  if (task.assigneeId && task.assigneeId !== req.user!.id) {
    await createNotification(task.assigneeId, 'task_assigned', 'Task assigned', `You were assigned: ${task.title}`, `/projects/${task.projectId}/tasks/${task.id}`);
  }
  await logActivity(req.user!.id, `Created task ${task.title}`, undefined, task.projectId, task.id);
  return res.status(201).json({ data: task });
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const where: Prisma.TaskWhereInput = {
    ...(req.query.projectId && { projectId: String(req.query.projectId) }),
    ...(asStatus(req.query.status) && { status: asStatus(req.query.status) }),
    ...(asPriority(req.query.priority) && { priority: asPriority(req.query.priority) }),
    ...(req.query.assigneeId && { assigneeId: String(req.query.assigneeId) }),
    ...(req.query.search && { title: { contains: String(req.query.search), mode: 'insensitive' } })
  };
  if (req.query.overdue === 'true') where.AND = [{ dueDate: { lt: new Date() } }, { status: { not: TaskStatus.DONE } }];
  const [data, total] = await Promise.all([
    prisma.task.findMany({ where, include: { assignee: true, creator: true }, skip: (page - 1) * limit, take: limit }),
    prisma.task.count({ where })
  ]);
  return res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
};

export const getTask = async (req: AuthRequest, res: Response) => {
  const taskId = String(req.params.id);
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
      assignee: true,
      creator: true,
      activityLogs: { orderBy: { createdAt: 'desc' } }
    }
  });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  return res.json({ data: task });
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const taskId = String(req.params.id);
  const old = await prisma.task.findUnique({ where: { id: taskId } });
  if (!old) return res.status(404).json({ message: 'Task not found' });
  const updates = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.coerce.date().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    position: z.number().int().optional()
  }).parse(req.body);
  const updated = await prisma.task.update({ where: { id: old.id }, data: updates, include: { assignee: true, creator: true } });
  const changed: Record<string, { old: unknown; new: unknown }> = {};
  Object.keys(updates).forEach((k) => (changed[k] = { old: (old as any)[k], new: (updated as any)[k] }));
  await logActivity(req.user!.id, `Updated task ${updated.title}`, changed, updated.projectId, updated.id);
  if (updates.assigneeId && updates.assigneeId !== old.assigneeId) {
    await createNotification(updates.assigneeId, 'task_assigned', 'Task assigned', `Assigned: ${updated.title}`, `/projects/${updated.projectId}/tasks/${updated.id}`);
  }
  return res.json({ data: updated });
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const taskId = String(req.params.id);
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const allowed = task.creatorId === req.user!.id || (await canAdminProject(req.user!.id, task.projectId));
  if (!allowed) return res.status(403).json({ message: 'Forbidden' });
  await logActivity(req.user!.id, `Deleted task ${task.title}`, undefined, task.projectId, task.id);
  await prisma.task.delete({ where: { id: task.id } });
  return res.json({ message: 'Task deleted' });
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  const taskId = String(req.params.id);
  const parsed = z.object({ status: z.nativeEnum(TaskStatus), position: z.number().int().default(0) }).parse(req.body);
  const data = await prisma.task.update({ where: { id: taskId }, data: parsed });
  return res.json({ data });
};

export const bulkUpdateTasks = async (req: AuthRequest, res: Response) => {
  const parsed = z.object({ ids: z.array(z.string()).min(1), status: z.nativeEnum(TaskStatus), projectId: z.string() }).parse(req.body);
  if (!(await canAdminProject(req.user!.id, parsed.projectId)) && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const result = await prisma.task.updateMany({ where: { id: { in: parsed.ids } }, data: { status: parsed.status } });
  return res.json({ updated: result.count });
};

export const getOverdueTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: {
      dueDate: { lt: new Date() },
      status: { not: TaskStatus.DONE },
      project: { OR: [{ ownerId: req.user!.id }, { members: { some: { userId: req.user!.id } } }] }
    },
    include: { project: { select: { name: true } }, assignee: true, creator: true }
  });
  return res.json({ data: tasks });
};

export const addComment = async (req: AuthRequest, res: Response) => {
  const taskId = String(req.params.id);
  const content = z.object({ content: z.string().trim().min(1) }).parse(req.body).content;
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const comment = await prisma.comment.create({ data: { content, taskId: task.id, authorId: req.user!.id }, include: { author: true } });
  if (task.assigneeId && task.assigneeId !== req.user!.id) {
    await createNotification(task.assigneeId, 'task_comment', 'New comment', `Comment on ${task.title}`, `/projects/${task.projectId}/tasks/${task.id}`);
  }
  await logActivity(req.user!.id, `Commented on task ${task.title}`, undefined, task.projectId, task.id);
  return res.status(201).json({ data: comment });
};

export const getComments = async (req: AuthRequest, res: Response) => {
  const taskId = String(req.params.id);
  const data = await prisma.comment.findMany({
    where: { taskId },
    include: { author: { select: { id: true, name: true, avatar: true, email: true, role: true, createdAt: true } } },
    orderBy: { createdAt: 'asc' }
  });
  return res.json({ data });
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  const commentId = String(req.params.commentId);
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { task: true }
  });
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  const isAdmin = await canAdminProject(req.user!.id, comment.task.projectId);
  if (comment.authorId !== req.user!.id && !isAdmin) return res.status(403).json({ message: 'Forbidden' });
  await prisma.comment.delete({ where: { id: comment.id } });
  return res.json({ message: 'Deleted' });
};
