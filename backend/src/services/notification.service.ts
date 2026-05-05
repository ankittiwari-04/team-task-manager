import { prisma } from '../utils/prisma';

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string
) => prisma.notification.create({ data: { userId, type, title, message, link } });

export const logActivity = async (
  userId: string,
  action: string,
  details?: object,
  projectId?: string,
  taskId?: string
) => prisma.activityLog.create({ data: { userId, action, details, projectId, taskId } });
