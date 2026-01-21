import { Router } from 'express';

import {
  assignPermissions,
  removePermission,
  getRolePermissions
} from '@/controllers/rolePermission.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  assignPermissionsSchema,
  removePermissionSchema,
  getRolePermissionsSchema
} from '@/schemas/rolePermission.schema';

const rolePermissionRouter = Router();

// Todas las rutas requieren autenticación
rolePermissionRouter.use(authenticate);

// POST /api/v1/roles/:roleId/permissions - Asignar permisos a un rol
rolePermissionRouter.post(
  '/:roleId/permissions',
  authorize(['role:assign-permissions']),
  validate(assignPermissionsSchema),
  assignPermissions
);

// GET /api/v1/roles/:roleId/permissions - Obtener permisos de un rol
rolePermissionRouter.get(
  '/:roleId/permissions',
  authorize(['role:view']),
  validate(getRolePermissionsSchema),
  getRolePermissions
);

// DELETE /api/v1/roles/:roleId/permissions/:permissionId - Remover permiso de un rol
rolePermissionRouter.delete(
  '/:roleId/permissions/:permissionId',
  authorize(['role:assign-permissions']),
  validate(removePermissionSchema),
  removePermission
);

export { rolePermissionRouter };
