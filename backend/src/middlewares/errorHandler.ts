import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error(err);
  res.status(500).json({
    error: env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
  });
};