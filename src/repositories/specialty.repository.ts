import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type {
  CreateSpecialtyDTO,
  Specialty,
  UpdateSpecialtyDTO
} from '@/types/specialty.types';

export async function create(
  data: CreateSpecialtyDTO,
  tx?: Prisma.TransactionClient
): Promise<Specialty> {
  const client = tx ?? prisma;

  const specialty = await client.specialty.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      area: data.area
    },
    select: {
      id: true,
      name: true,
      description: true,
      area: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return {
    id: specialty.id,
    name: specialty.name,
    description: specialty.description ?? undefined,
    area: specialty.area,
    createdAt: specialty.createdAt
  };
}

export async function findById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<Specialty | null> {
  const client = tx ?? prisma;

  const specialty = await client.specialty.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      description: true,
      area: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!specialty) return null;

  return {
    id: specialty.id,
    name: specialty.name,
    description: specialty.description ?? undefined,
    area: specialty.area,
    createdAt: specialty.createdAt
  };
}

export async function findByName(
  name: string,
  tx?: Prisma.TransactionClient
): Promise<Specialty | null> {
  const client = tx ?? prisma;

  const specialty = await client.specialty.findFirst({
    where: {
      name,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      description: true,
      area: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!specialty) return null;

  return {
    id: specialty.id,
    name: specialty.name,
    description: specialty.description ?? undefined,
    area: specialty.area,
    createdAt: specialty.createdAt
  };
}

export async function findAll(
  filters: { term: string | undefined; area: string | undefined },
  page: number,
  limit: number,
  tx?: Prisma.TransactionClient
): Promise<{ specialties: Specialty[]; total: number }> {
  const client = tx ?? prisma;

  const where: Prisma.SpecialtyWhereInput = {
    deletedAt: null,
    isActive: true
  };

  if (filters.term) {
    where.name = {
      contains: filters.term,
      mode: 'insensitive'
    };
  }

  if (filters.area) {
    where.area = filters.area as
      | 'MEDICINA_GENERAL'
      | 'ODONTOLOGIA'
      | 'ADMINISTRATIVO';
  }

  const skip = (page - 1) * limit;

  const [specialties, total] = await Promise.all([
    client.specialty.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        area: true,
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
    client.specialty.count({ where })
  ]);

  return {
    specialties: specialties.map((specialty) => ({
      id: specialty.id,
      name: specialty.name,
      description: specialty.description ?? undefined,
      area: specialty.area,
      createdAt: specialty.createdAt
    })),
    total
  };
}

export async function update(
  id: string,
  data: UpdateSpecialtyDTO,
  tx?: Prisma.TransactionClient
): Promise<Specialty> {
  const client = tx ?? prisma;

  const specialty = await client.specialty.update({
    where: { id, isActive: true, deletedAt: null },
    data: {
      name: data.name,
      description: data.description,
      area: data.area,
      updatedAt: new Date()
    },
    select: {
      id: true,
      name: true,
      description: true,
      area: true,
      createdAt: true
    }
  });

  return {
    id: specialty.id,
    name: specialty.name,
    description: specialty.description ?? undefined,
    area: specialty.area,
    createdAt: specialty.createdAt
  };
}

export async function deleteById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.specialty.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
      updatedAt: new Date()
    }
  });
}
