import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user.id, email: user.email, role: user.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Admin access required' });
  return next();
};

export const requireProjectAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id || req.params.projectId || req.body.projectId;
    if (!projectId || !req.user) return next();
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: req.user.id } }
    });
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || (!member && project.ownerId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }
    return next();
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};
