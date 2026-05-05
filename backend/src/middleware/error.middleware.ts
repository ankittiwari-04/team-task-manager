import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const message = err.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return res.status(400).json({ message });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
