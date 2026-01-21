import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type { Permission } from '@/types/permission.types';

export async function findAll(
  tx?: Prisma.TransactionClient
): Promise<Permission[]> {
  const client = tx ?? prisma;

  const permissions = await client.permission.findMany({
    where: {
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return permissions.map((permission) => ({
    id: permission.id,
    name: permission.name,
    description: permission.description ?? undefined,
    isActive: permission.isActive
  }));
}
