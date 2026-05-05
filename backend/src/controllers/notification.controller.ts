import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const [data, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.notification.count({ where: { userId: req.user!.id } }),
    prisma.notification.count({ where: { userId: req.user!.id, isRead: false } })
  ]);
  return res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit), unreadCount });
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const notificationId = req.params.id ? String(req.params.id) : undefined;
  if (notificationId) {
    await prisma.notification.updateMany({ where: { id: notificationId, userId: req.user!.id }, data: { isRead: true } });
  } else {
    await prisma.notification.updateMany({ where: { userId: req.user!.id }, data: { isRead: true } });
  }
  return res.json({ message: 'Updated' });
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  const notificationId = String(req.params.id);
  const noti = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!noti || noti.userId !== req.user!.id) return res.status(404).json({ message: 'Notification not found' });
  await prisma.notification.delete({ where: { id: notificationId } });
  return res.json({ message: 'Deleted' });
};
