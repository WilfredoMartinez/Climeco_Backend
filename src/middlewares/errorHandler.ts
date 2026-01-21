import type { Request, Response, NextFunction } from 'express';

import logger from '@/lib/logger';
import type { AppError } from '@/types/api';

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  logger.error(err.message, { path: req.path, stack: err.stack });

  const status =
    err.status && err.status >= 400 && err.status < 500 ? err.status : 500;

  const message = status === 500 ? 'Internal server error' : err.message;

  return res.status(status).json({
    message,
    ok: false
  });
}
