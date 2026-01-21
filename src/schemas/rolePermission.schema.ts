import { z } from 'zod';

// Schema para asignar permisos a un rol
export const assignPermissionsSchema = z.object({
  permissionIds: z
    .array(z.uuid('ID de permiso inválido'))
    .min(1, 'Debe proporcionar al menos un permiso')
    .max(250, 'No puede asignar más de 250 permisos a la vez')
});

// Schema para remover un permiso de un rol
export const removePermissionSchema = z.object({
  roleId: z.uuid('ID de rol inválido'),
  permissionId: z.uuid('ID de permiso inválido')
});

// Schema para obtener permisos de un rol
export const getRolePermissionsSchema = z.object({
  roleId: z.uuid('ID de rol inválido')
});
