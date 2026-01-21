import type { Request, Response, NextFunction } from 'express';

import { verifyToken } from '@/lib/auth';
import { createUnauthorizedError } from '@/lib/errors';

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      createUnauthorizedError('El token de autenticación es requerido.')
    );
  }

  const token = authHeader.replace('Bearer ', '');
  const decodedPayload = verifyToken(token);

  if (!decodedPayload)
    return next(createUnauthorizedError('Token de autenticación inválido.'));

  req.currentUser = decodedPayload;

  return next();
}
