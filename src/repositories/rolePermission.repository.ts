import type { Prisma } from '@prisma/client';
import type { GetBatchResult } from '@prisma/client/runtime/library';

import { prisma } from '@/lib/prisma';
import type { RolePermissionResult } from '@/types/rolePermission.types';

/**
 * Asignar múltiples permisos a un rol
 */
export const assignPermissionsToRole = async (
  roleId: string,
  permissionIds: string[],
  tx?: Prisma.TransactionClient
): Promise<GetBatchResult> => {
  const client = tx ?? prisma;

  // Crear las relaciones, ignorando duplicados
  const data = permissionIds.map((permissionId) => ({
    roleId,
    permissionId
  }));

  return await client.rolePermission.createMany({
    data,
    skipDuplicates: true // Evita errores si ya existe la relación
  });
};

/**
 * Remover un permiso de un rol
 */
export const removePermissionFromRole = async (
  roleId: string,
  permissionId: string,
  tx?: Prisma.TransactionClient
): Promise<void> => {
  const client = tx ?? prisma;

  await client.rolePermission.delete({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId
      }
    }
  });
};

/**
 * Obtener todos los permisos de un rol
 */
export const getRolePermissions = async (
  roleId: string,
  tx?: Prisma.TransactionClient
): Promise<RolePermissionResult[]> => {
  const client = tx ?? prisma;

  return await client.rolePermission.findMany({
    where: {
      roleId
    },
    select: {
      roleId: true,
      permissionId: true,
      permission: {
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true
        }
      }
    }
  });
};

/**
 * Verificar si un rol tiene un permiso específico
 */
export const roleHasPermission = async (
  roleId: string,
  permissionId: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const client = tx ?? prisma;

  const count = await client.rolePermission.count({
    where: {
      roleId,
      permissionId
    }
  });

  return count > 0;
};

/**
 * Verificar si un rol existe
 */
export const roleExists = async (
  roleId: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const client = tx ?? prisma;

  const count = await client.role.count({
    where: {
      id: roleId,
      deletedAt: null
    }
  });

  return count > 0;
};

/**
 * Verificar si todos los permisos existen
 */
export const permissionsExist = async (
  permissionIds: string[],
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const client = tx ?? prisma;

  const count = await client.permission.count({
    where: {
      id: {
        in: permissionIds
      },
      deletedAt: null
    }
  });

  return count === permissionIds.length;
};
