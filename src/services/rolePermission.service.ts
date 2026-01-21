import { createNotFoundError, createBadRequestError } from '@/lib/errors';
import * as rolePermissionRepository from '@/repositories/rolePermission.repository';
import { logActivity } from '@/services/activityLog.service';
import type {
  AssignPermissionsDTO,
  RolePermissionResult
} from '@/types/rolePermission.types';

export const assignPermissions = async (
  roleId: string,
  data: AssignPermissionsDTO,
  userId: string
): Promise<{ count: number }> => {
  const roleExistsCheck = await rolePermissionRepository.roleExists(roleId);

  if (!roleExistsCheck)
    throw createNotFoundError('El rol especificado no existe');

  const permissionsExistCheck = await rolePermissionRepository.permissionsExist(
    data.permissionIds
  );

  if (!permissionsExistCheck)
    throw createBadRequestError('Uno o más permisos especificados no existen');

  const result = await rolePermissionRepository.assignPermissionsToRole(
    roleId,
    data.permissionIds
  );

  await logActivity({
    userId,
    action: 'ROLE_PERMISSION:ASSIGN',
    newValue: { roleId, permissionIds: data.permissionIds, count: result.count }
  });

  return { count: result.count };
};

export const removePermission = async (
  roleId: string,
  permissionId: string,
  userId: string
): Promise<void> => {
  const roleExistsCheck = await rolePermissionRepository.roleExists(roleId);
  if (!roleExistsCheck)
    throw createNotFoundError('El rol especificado no existe');

  const hasPermission = await rolePermissionRepository.roleHasPermission(
    roleId,
    permissionId
  );

  if (!hasPermission)
    throw createNotFoundError('El rol no tiene asignado ese permiso');

  await rolePermissionRepository.removePermissionFromRole(roleId, permissionId);

  await logActivity({
    userId,
    action: 'ROLE_PERMISSION:REMOVE',
    oldValue: { roleId, permissionId }
  });
};

export const getRolePermissions = async (
  roleId: string
): Promise<RolePermissionResult[]> => {
  const roleExistsCheck = await rolePermissionRepository.roleExists(roleId);

  if (!roleExistsCheck)
    throw createNotFoundError('El rol especificado no existe');

  return await rolePermissionRepository.getRolePermissions(roleId);
};
