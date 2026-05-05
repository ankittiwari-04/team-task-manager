import jwt from 'jsonwebtoken';

export const generateToken = (payload: { id: string; email: string; role: string }) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });

export const generateRefreshToken = (payload: { id: string }) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });
