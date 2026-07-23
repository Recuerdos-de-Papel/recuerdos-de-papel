import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error('ERROR DETALLADO:', err);
  res.status(500).json({
    error: err.message,
    stack: env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
