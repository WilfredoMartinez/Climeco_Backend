import type z from 'zod';

import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import * as roleRepository from '@/repositories/role.repository';
import type {
  createRoleSchema,
  getRolesQuerySchema,
  updateRoleSchema
} from '@/schemas/role.schema';
import { logActivity } from '@/services/activityLog.service';
import type { Role } from '@/types/role.types';

export async function createRole(
  data: z.infer<typeof createRoleSchema>,
  userId: string
): Promise<Role> {
  const existingRole = await roleRepository.findByName(data.name);

  if (existingRole)
    throw createBadRequestError('Ya existe un rol con ese nombre');

  const roleData = {
    name: data.name,
    description: data.description ?? undefined
  };

  const newRole = await roleRepository.create(roleData);

  await logActivity({
    userId,
    action: 'ROLE:CREATE',
    newValue: { id: newRole.id, name: newRole.name }
  });

  return newRole;
}

export async function getRoleById(id: string): Promise<Role> {
  const role = await roleRepository.findById(id);

  if (!role) throw createNotFoundError('Rol no encontrado');

  return role;
}

export async function getAllRoles(
  query: z.infer<typeof getRolesQuerySchema>
): Promise<{ roles: Role[]; total: number }> {
  const { page, limit, term } = query;

  const filters = {
    term
  };

  const { roles, total } = await roleRepository.findAll(
    filters,
    Number(page),
    Number(limit)
  );

  return {
    roles,
    total: Number(total)
  };
}

export async function updateRole(
  id: string,
  data: z.infer<typeof updateRoleSchema>,
  userId: string
): Promise<Role> {
  const role = await roleRepository.findById(id);

  if (!role) throw createNotFoundError('Rol no encontrado');

  if (data.name && data.name !== role.name) {
    const existingRole = await roleRepository.findByName(data.name);

    if (existingRole)
      throw createBadRequestError('Ya existe un rol con ese nombre');
  }

  const updatedRole = await roleRepository.update(id, data);

  await logActivity({
    userId,
    action: 'ROLE:UPDATE',
    oldValue: { id: role.id, name: role.name },
    newValue: { id: updatedRole.id, name: updatedRole.name }
  });

  return updatedRole;
}

export async function deleteRole(id: string, userId: string): Promise<void> {
  const role = await roleRepository.findById(id);

  if (!role) throw createNotFoundError('Rol no encontrado');

  await roleRepository.deleteById(id);

  await logActivity({
    userId,
    action: 'ROLE:DELETE',
    oldValue: { id: role.id, name: role.name }
  });
}
