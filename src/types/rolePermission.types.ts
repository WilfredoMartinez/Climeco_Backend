import type { z } from 'zod';

import type {
  assignPermissionsSchema,
  removePermissionSchema,
  getRolePermissionsSchema
} from '@/schemas/rolePermission.schema';

// DTOs inferidos de los schemas Zod
export type AssignPermissionsDTO = z.infer<typeof assignPermissionsSchema>;
export type RemovePermissionParams = z.infer<typeof removePermissionSchema>;
export type GetRolePermissionsParams = z.infer<typeof getRolePermissionsSchema>;

// Tipo para el resultado de listar permisos de un rol
export type RolePermissionResult = {
  roleId: string;
  permissionId: string;
  permission: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
  };
};
