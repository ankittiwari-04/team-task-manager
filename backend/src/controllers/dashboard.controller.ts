import { Role, TaskStatus } from '@prisma/client';
import { Response } from 'express';
import { eachDayOfInterval, format, startOfDay, subDays } from 'date-fns';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const todayStart = startOfDay(new Date());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const myProjectsWhere = { OR: [{ ownerId: userId }, { members: { some: { userId } } }] };

  const [totalProjects, activeTasks, completedTasks, overdueTasks, tasksDueToday, myTasks, recentActivity, projects] = await Promise.all([
    prisma.project.count({ where: myProjectsWhere }),
    prisma.task.count({ where: { assigneeId: userId, status: { not: TaskStatus.DONE } } }),
    prisma.task.count({ where: { assigneeId: userId, status: TaskStatus.DONE } }),
    prisma.task.count({ where: { assigneeId: userId, dueDate: { lt: new Date() }, status: { not: TaskStatus.DONE } } }),
    prisma.task.count({ where: { assigneeId: userId, dueDate: { gte: todayStart, lt: tomorrowStart } } }),
    prisma.task.findMany({ where: { assigneeId: userId }, select: { status: true } }),
    prisma.activityLog.findMany({ where: { project: myProjectsWhere }, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } }, take: 20 }),
    prisma.project.findMany({ where: myProjectsWhere, include: { tasks: true } })
  ]);

  const myTasksByStatus = Object.values(TaskStatus).reduce<Record<string, number>>((acc, status) => ({ ...acc, [status]: myTasks.filter((t: any) => t.status === status).length }), {});
  const projectsSummary = projects.map((p: any) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t: any) => t.status === TaskStatus.DONE).length;
    return { name: p.name, color: p.color, totalTasks: total, completedTasks: done, progress: total ? Math.round((done / total) * 100) : 0 };
  });

  const start = subDays(todayStart, 29);
  const days = eachDayOfInterval({ start, end: todayStart });
  const completed = await prisma.task.findMany({
    where: { assigneeId: userId, status: TaskStatus.DONE, updatedAt: { gte: start } },
    select: { updatedAt: true }
  });
  const completionChartData = days.map((d) => ({
    date: format(d, 'yyyy-MM-dd'),
    count: completed.filter((t: any) => format(t.updatedAt, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')).length
  }));

  let topMembers: Array<{ userId: string; name: string; completed: number }> = [];
  if (req.user?.role === Role.ADMIN) {
    const rows = await prisma.task.groupBy({
      by: ['assigneeId'],
      where: { status: TaskStatus.DONE, assigneeId: { not: null } },
      _count: { assigneeId: true },
      orderBy: { _count: { assigneeId: 'desc' } },
      take: 5
    });
    const userIds = rows.map((r) => r.assigneeId!).filter(Boolean);
    const userList = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true }
    });
    topMembers = rows.map((r) => ({
      userId: r.assigneeId!,
      name: userList.find((u) => u.id === r.assigneeId)?.name || 'Unknown',
      completed: r._count.assigneeId
    }));
  }

  return res.json({
    totalProjects,
    activeTasks,
    completedTasks,
    overdueTasks,
    tasksDueToday,
    myTasksByStatus,
    recentActivity,
    projectsSummary,
    completionChartData,
    ...(req.user?.role === Role.ADMIN && { topMembers })
  });
};
