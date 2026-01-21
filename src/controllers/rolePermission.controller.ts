import type { Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess, sendNoContent } from '@/lib/responses';
import * as rolePermissionService from '@/services/rolePermission.service';
import type { AssignPermissionsDTO } from '@/types/rolePermission.types';

/**
 * Asignar permisos a un rol
 */
export const assignPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { roleId } = req.params;
    const data = req.body as AssignPermissionsDTO;
    const userId = req.currentUser!.id;

    const result = await rolePermissionService.assignPermissions(
      roleId,
      data,
      userId
    );

    sendSuccess(res, result, 'Permisos asignados exitosamente', 200);
  }
);

/**
 * Remover un permiso de un rol
 */
export const removePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const { roleId, permissionId } = req.params;
    const userId = req.currentUser!.id;

    await rolePermissionService.removePermission(roleId, permissionId, userId);

    sendNoContent(res);
  }
);

/**
 * Obtener permisos de un rol
 */
export const getRolePermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const { roleId } = req.params;

    const permissions = await rolePermissionService.getRolePermissions(roleId);

    sendSuccess(res, permissions, 'Permisos obtenidos exitosamente', 200);
  }
);
