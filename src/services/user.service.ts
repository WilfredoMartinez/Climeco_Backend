import bcrypt from 'bcryptjs';

import {
  createBadRequestError,
  createConflictError,
  createNotFoundError
} from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import type { UserDetail } from '@/repositories/user.repository';
import * as userRepository from '@/repositories/user.repository';
import * as activityLogService from '@/services/activityLog.service';
import type {
  ChangePasswordInput,
  CreateUserInput,
  GetUsersQuery,
  UpdateUserInput
} from '@/types/user.types';

export async function getUsers(query: GetUsersQuery): Promise<{
  users: UserDetail[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  const { page, limit, roleId, specialtyId, area, isActive } = query;

  const { users, total } = await userRepository.findAllUsers(page, limit, {
    roleId,
    specialtyId,
    area,
    isActive
  });

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getUserById(id: string): Promise<UserDetail> {
  const user = await userRepository.findUserDetailById(id);

  if (!user) {
    throw createNotFoundError('Usuario no encontrado');
  }

  return user;
}

export async function createUser(
  data: CreateUserInput,
  currentUserId: string
): Promise<UserDetail> {
  return await prisma.$transaction(async (tx) => {
    const existingUser = await userRepository.findUserByUsername(data.username);

    if (existingUser) {
      throw createConflictError('El username ya está en uso');
    }

    const role = await tx.role.findUnique({
      where: { id: data.roleId }
    });

    if (!role) {
      throw createNotFoundError('Rol no encontrado');
    }

    const specialty = await tx.specialty.findUnique({
      where: { id: data.specialtyId }
    });

    if (!specialty) {
      throw createNotFoundError('Especialidad no encontrada');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await userRepository.createUser(
      {
        ...data,
        passwordHash
      },
      tx
    );

    await activityLogService.logActivity({
      userId: currentUserId,
      action: `Usuario creado: ${user.username}`,
      newValue: JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        specialty: user.specialty
      }),
      tx
    });

    return user;
  });
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
  currentUserId: string
): Promise<UserDetail> {
  return await prisma.$transaction(async (tx) => {
    const existingUser = await userRepository.findUserDetailById(id);

    if (!existingUser) {
      throw createNotFoundError('Usuario no encontrado');
    }

    if (data.username && data.username !== existingUser.username) {
      const usernameTaken = await userRepository.findUserByUsername(
        data.username
      );

      if (usernameTaken) {
        throw createConflictError('El username ya está en uso');
      }
    }

    if (data.roleId) {
      const role = await tx.role.findUnique({
        where: { id: data.roleId }
      });

      if (!role) {
        throw createNotFoundError('Rol no encontrado');
      }
    }

    if (data.specialtyId) {
      const specialty = await tx.specialty.findUnique({
        where: { id: data.specialtyId }
      });

      if (!specialty) {
        throw createNotFoundError('Especialidad no encontrada');
      }
    }

    const updatedUser = await userRepository.updateUser(id, data, tx);

    await activityLogService.logActivity({
      userId: currentUserId,
      action: `Usuario actualizado: ${updatedUser.username}`,
      oldValue: JSON.stringify({
        username: existingUser.username,
        fullname: existingUser.fullname,
        role: existingUser.role,
        specialty: existingUser.specialty,
        isActive: existingUser.isActive
      }),
      newValue: JSON.stringify({
        username: updatedUser.username,
        fullname: updatedUser.fullname,
        role: updatedUser.role,
        specialty: updatedUser.specialty,
        isActive: updatedUser.isActive
      }),
      tx
    });

    return updatedUser;
  });
}

export async function changePassword(
  id: string,
  data: ChangePasswordInput,
  currentUserId: string
): Promise<void> {
  return await prisma.$transaction(async (tx) => {
    const user = await userRepository.findUserById(id);

    if (!user) {
      throw createNotFoundError('Usuario no encontrado');
    }

    const isValidPassword = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw createBadRequestError('Contraseña actual incorrecta');
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await userRepository.updateUserPassword(id, passwordHash, tx);

    await activityLogService.logActivity({
      userId: currentUserId,
      action: `Contraseña cambiada para usuario: ${user.username}`,
      tx
    });
  });
}

export async function deleteUser(
  id: string,
  currentUserId: string
): Promise<void> {
  return await prisma.$transaction(async (tx) => {
    const user = await userRepository.findUserDetailById(id);

    if (!user) {
      throw createNotFoundError('Usuario no encontrado');
    }

    if (id === currentUserId) {
      throw createBadRequestError('No puedes eliminar tu propio usuario');
    }

    await userRepository.deleteUser(id, tx);

    await activityLogService.logActivity({
      userId: currentUserId,
      action: `Usuario eliminado: ${user.username}`,
      oldValue: JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        specialty: user.specialty
      }),
      tx
    });
  });
}
