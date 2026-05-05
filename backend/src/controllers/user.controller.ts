import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return res.json({ data: users.map((user) => { const { password, ...u } = user; return u; }) });
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: String(req.params.id) } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = user;
  return res.json({ data: safe });
};

export const searchUsers = async (req: AuthRequest, res: Response) => {
  const q = (req.query.q as string) || '';
  const users = await prisma.user.findMany({
    where: { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] },
    take: 20
  });
  return res.json({ data: users.map((user) => { const { password, ...u } = user; return u; }) });
};
