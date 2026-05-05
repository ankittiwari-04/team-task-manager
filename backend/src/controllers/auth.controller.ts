import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../utils/prisma';
import { generateRefreshToken, generateToken } from '../utils/jwt';

const sanitize = <T extends { password: string }>(user: T) => {
  const { password, ...rest } = user;
  return rest;
};

export const register = async (req: AuthRequest, res: Response) => {
  const schema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8) });
  const parsed = schema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const password = await bcrypt.hash(parsed.password, 12);
  const user = await prisma.user.create({ data: { ...parsed, password } });
  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return res.status(201).json({ token, user: sanitize(user) });
};

export const login = async (req: AuthRequest, res: Response) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const parsed = schema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (!user || !(await bcrypt.compare(parsed.password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return res.json({
    token: generateToken({ id: user.id, email: user.email, role: user.role }),
    refreshToken: generateRefreshToken({ id: user.id }),
    user: sanitize(user)
  });
};

export const refreshToken = async (req: AuthRequest, res: Response) => {
  const token = req.body.refreshToken;
  if (!token) return res.status(400).json({ message: 'Refresh token is required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    return res.json({ token: generateToken({ id: user.id, email: user.email, role: user.role }) });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user: sanitize(user) });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const parsed = z.object({ name: z.string().min(1).optional(), avatar: z.string().url().nullable().optional() }).parse(req.body);
  const user = await prisma.user.update({ where: { id: req.user!.id }, data: parsed });
  return res.json({ user: sanitize(user) });
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const parsed = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user || !(await bcrypt.compare(parsed.currentPassword, user.password))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }
  await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(parsed.newPassword, 12) } });
  return res.json({ message: 'Password changed successfully' });
};
