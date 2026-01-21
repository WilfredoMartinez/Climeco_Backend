import { Router } from 'express';

import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole
} from '@/controllers/role.controller';
import {
  assignPermissions,
  removePermission,
  getRolePermissions
} from '@/controllers/rolePermission.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  createRoleSchema,
  getRolesQuerySchema,
  roleIdSchema,
  updateRoleSchema
} from '@/schemas/role.schema';
import {
  assignPermissionsSchema,
  removePermissionSchema,
  getRolePermissionsSchema
} from '@/schemas/rolePermission.schema';

const rolesRouter = Router();

rolesRouter.use(authenticate);

rolesRouter.get(
  '/',
  authorize(['roles:read']),
  validate(getRolesQuerySchema, 'query'),
  getRoles
);
rolesRouter.post(
  '/',
  authorize(['roles:create']),
  validate(createRoleSchema),
  createRole
);
rolesRouter.get(
  '/:id',
  authorize(['roles:read']),
  validate(roleIdSchema, 'params'),
  getRoleById
);
rolesRouter.put(
  '/:id',
  authorize(['roles:update']),
  validateMultiple({
    params: roleIdSchema,
    body: updateRoleSchema
  }),
  updateRole
);
rolesRouter.delete(
  '/:id',
  authorize(['roles:delete']),
  validate(roleIdSchema, 'params'),
  deleteRole
);

// Rutas para gestión de permisos de roles
rolesRouter.post(
  '/:roleId/permissions',
  authorize(['roles:assign-permissions']),
  validateMultiple({
    params: getRolePermissionsSchema,
    body: assignPermissionsSchema
  }),
  assignPermissions
);

rolesRouter.get(
  '/:roleId/permissions',
  authorize(['roles:read']),
  validate(getRolePermissionsSchema, 'params'),
  getRolePermissions
);

rolesRouter.delete(
  '/:roleId/permissions/:permissionId',
  authorize(['roles:assign-permissions']),
  validate(removePermissionSchema, 'params'),
  removePermission
);

export default rolesRouter;
