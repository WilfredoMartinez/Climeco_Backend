import type { Request, Response, NextFunction } from 'express';

import { createForbiddenError, createUnauthorizedError } from '@/lib/errors';

/**
 * Middleware para verificar que el usuario tiene los permisos necesarios
 * @param permissions - Uno o más permisos requeridos, se requiere que el usuario tenga todos los permisos especificados para acceder a la ruta.
 */
export const authorize = (permissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.currentUser;

    if (!user) throw createUnauthorizedError('Usuario no autenticado');

    const hasAllPermissions = user.permissionGroups.some(
      (group: string): boolean => permissions.includes(group)
    );

    if (!hasAllPermissions)
      throw createForbiddenError('Acceso denegado, permiso insuficiente');

    next();
  };
};
