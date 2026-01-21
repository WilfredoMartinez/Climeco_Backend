import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type { CreateRoleDTO, Role, UpdateRoleDTO } from '@/types/role.types';

export async function create(
  data: CreateRoleDTO,
  tx?: Prisma.TransactionClient
): Promise<Role> {
  const client = tx ?? prisma;

  const role = await client.role.create({
    data: {
      name: data.name,
      description: data.description ?? null
    },
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return {
    id: role.id,
    name: role.name,
    description: role.description ?? undefined,
    createdAt: role.createdAt
  };
}

export async function findById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<Role | null> {
  const client = tx ?? prisma;

  const role = await client.role.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!role) return null;

  return {
    id: role.id,
    name: role.name,
    description: role.description ?? undefined,
    createdAt: role.createdAt
  };
}

export async function findByName(
  name: string,
  tx?: Prisma.TransactionClient
): Promise<Role | null> {
  const client = tx ?? prisma;

  const role = await client.role.findFirst({
    where: {
      name,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!role) return null;

  return {
    id: role.id,
    name: role.name,
    description: role.description ?? undefined,
    createdAt: role.createdAt
  };
}

export async function findAll(
  filters: { term: string | undefined },
  page: number,
  limit: number,
  tx?: Prisma.TransactionClient
): Promise<{ roles: Role[]; total: number }> {
  const client = tx ?? prisma;

  const where: Prisma.RoleWhereInput = {
    deletedAt: null,
    isActive: true
  };

  if (filters.term) {
    where.name = {
      contains: filters.term,
      mode: 'insensitive'
    };
  }

  const skip = (page - 1) * limit;

  const [roles, total] = await Promise.all([
    client.role.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    client.role.count({ where })
  ]);

  return {
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description ?? undefined,
      createdAt: role.createdAt
    })),
    total
  };
}

export async function update(
  id: string,
  data: UpdateRoleDTO,
  tx?: Prisma.TransactionClient
): Promise<Role> {
  const client = tx ?? prisma;

  const role = await client.role.update({
    where: { id, isActive: true, deletedAt: null },
    data: {
      name: data.name,
      description: data.description,
      updatedAt: new Date()
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true
    }
  });

  return {
    id: role.id,
    name: role.name,
    description: role.description ?? undefined,
    createdAt: role.createdAt
  };
}

export async function deleteById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.role.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
      updatedAt: new Date()
    }
  });
}
