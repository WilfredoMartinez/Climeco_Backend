import type { Prisma } from '@prisma/client';

import type { PrismaTransactionClient } from '@/lib/prisma';
import { prisma } from '@/lib/prisma';
import type { CreateUserInput, UpdateUserInput } from '@/types/user.types';

interface UserWithHashPassword {
  id: string;
  username: string;
  passwordHash: string;
  fullname: string;
  phone?: string;
  role: string;
  specialty: string;
  area: string;
  isActive: boolean;
  createdAt: Date;
  permissionGroups: string[];
}

export interface UserDetail {
  id: string;
  username: string;
  fullname: string;
  phone?: string;
  role: string;
  roleId: string;
  specialty: string;
  specialtyId: string;
  roleDescription?: string;
  specialtyDescription?: string;
  isActive: boolean;
  createdAt: Date;
  permissions: string[];
}

export async function findUserByUsername(
  username: string
): Promise<UserWithHashPassword | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      role: {
        include: {
          rolePermissions: {
            where: {
              permission: {
                isActive: true
              }
            },
            include: {
              permission: true
            }
          }
        }
      },
      specialty: true
    }
  });

  if (!user) return null;

  const permissionGroups = user.role.rolePermissions.map(
    (rp) => rp.permission.name
  );

  return {
    id: user.id,
    username: user.username,
    passwordHash: user.passwordHash,
    fullname: user.fullName,
    phone: user.phone ?? undefined,
    role: user.role.name,
    specialty: user.specialty.name,
    area: user.specialty.area,
    isActive: user.isActive,
    createdAt: user.createdAt,
    permissionGroups
  };
}

export async function findUserById(
  id: string
): Promise<UserWithHashPassword | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        include: {
          rolePermissions: {
            where: {
              permission: {
                isActive: true
              }
            },
            include: {
              permission: true
            }
          }
        }
      },
      specialty: true
    }
  });

  if (!user) {
    return null;
  }

  const permissionGroups = user.role.rolePermissions.map(
    (rp) => rp.permission.name
  );

  return {
    id: user.id,
    username: user.username,
    passwordHash: user.passwordHash,
    fullname: user.fullName,
    phone: user.phone ?? undefined,
    role: user.role.name,
    specialty: user.specialty.name,
    area: user.specialty.area,
    isActive: user.isActive,
    createdAt: user.createdAt,
    permissionGroups
  };
}

export async function findAllUsers(
  page: number,
  limit: number,
  filters: {
    roleId?: string;
    specialtyId?: string;
    area?: string[];
    isActive?: boolean;
  }
): Promise<{ users: UserDetail[]; total: number }> {
  const where: Prisma.UserWhereInput = {
    ...(filters.roleId && { roleId: filters.roleId }),
    ...(filters.specialtyId && { specialtyId: filters.specialtyId }),
    ...(filters.isActive !== undefined && { isActive: filters.isActive })
  };

  // Filtro por áreas (soporta múltiples valores)
  if (filters.area && filters.area.length > 0) {
    where.specialty = {
      area: {
        in: filters.area as Array<
          'MEDICINA_GENERAL' | 'ODONTOLOGIA' | 'ADMINISTRATIVO'
        >
      }
    };
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        },
        specialty: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users: users.map((user) => ({
      id: user.id,
      username: user.username,
      fullname: user.fullName,
      phone: user.phone ?? undefined,
      role: user.role.name,
      roleId: user.roleId,
      specialty: user.specialty.name,
      specialtyId: user.specialtyId,
      roleDescription: user.role.description ?? undefined,
      specialtyDescription: user.specialty.description ?? undefined,
      isActive: user.isActive,
      createdAt: user.createdAt,
      permissions: user.role.rolePermissions.map((rp) => rp.permission.name)
    })),
    total
  };
}

export async function findUserDetailById(
  id: string
): Promise<UserDetail | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      },
      specialty: true
    }
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    fullname: user.fullName,
    phone: user.phone ?? undefined,
    role: user.role.name,
    roleId: user.roleId,
    specialty: user.specialty.name,
    specialtyId: user.specialtyId,
    roleDescription: user.role.description ?? undefined,
    specialtyDescription: user.specialty.description ?? undefined,
    isActive: user.isActive,
    createdAt: user.createdAt,
    permissions: user.role.rolePermissions.map((rp) => rp.permission.name)
  };
}

export async function createUser(
  data: CreateUserInput & { passwordHash: string },
  tx?: PrismaTransactionClient
): Promise<UserDetail> {
  const client = tx ?? prisma;

  const user = await client.user.create({
    data: {
      roleId: data.roleId,
      specialtyId: data.specialtyId,
      username: data.username,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      phone: data.phone ?? null
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      },
      specialty: true
    }
  });

  return {
    id: user.id,
    username: user.username,
    fullname: user.fullName,
    phone: user.phone ?? undefined,
    role: user.role.name,
    roleId: user.roleId,
    specialty: user.specialty.name,
    specialtyId: user.specialtyId,
    roleDescription: user.role.description ?? undefined,
    specialtyDescription: user.specialty.description ?? undefined,
    isActive: user.isActive,
    createdAt: user.createdAt,
    permissions: user.role.rolePermissions.map((rp) => rp.permission.name)
  };
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
  tx?: PrismaTransactionClient
): Promise<UserDetail> {
  const client = tx ?? prisma;

  const user = await client.user.update({
    where: { id },
    data: {
      ...(data.roleId && { roleId: data.roleId }),
      ...(data.specialtyId && { specialtyId: data.specialtyId }),
      ...(data.username && { username: data.username }),
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.isActive !== undefined && { isActive: data.isActive })
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      },
      specialty: true
    }
  });

  return {
    id: user.id,
    username: user.username,
    fullname: user.fullName,
    phone: user.phone ?? undefined,
    role: user.role.name,
    roleId: user.roleId,
    specialty: user.specialty.name,
    specialtyId: user.specialtyId,
    roleDescription: user.role.description ?? undefined,
    specialtyDescription: user.specialty.description ?? undefined,
    isActive: user.isActive,
    createdAt: user.createdAt,
    permissions: user.role.rolePermissions.map((rp) => rp.permission.name)
  };
}

export async function updateUserPassword(
  id: string,
  passwordHash: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.user.update({
    where: { id },
    data: { passwordHash }
  });
}

export async function deleteUser(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.user.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}
