import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type {
  CreateMedicationCategoryDTO,
  MedicationCategory,
  UpdateMedicationCategoryDTO
} from '@/types/medicationCategory.types';

export async function create(
  data: CreateMedicationCategoryDTO,
  tx?: Prisma.TransactionClient
): Promise<MedicationCategory> {
  const client = tx ?? prisma;

  const medicationCategory = await client.medicationCategory.create({
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
    id: medicationCategory.id,
    name: medicationCategory.name,
    description: medicationCategory.description ?? undefined,
    createdAt: medicationCategory.createdAt
  };
}

export async function findById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<MedicationCategory | null> {
  const client = tx ?? prisma;

  const medicationCategory = await client.medicationCategory.findFirst({
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

  if (!medicationCategory) return null;

  return {
    id: medicationCategory.id,
    name: medicationCategory.name,
    description: medicationCategory.description ?? undefined,
    createdAt: medicationCategory.createdAt
  };
}

export async function findByName(
  name: string,
  tx?: Prisma.TransactionClient
): Promise<MedicationCategory | null> {
  const client = tx ?? prisma;

  const medicationCategory = await client.medicationCategory.findFirst({
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

  if (!medicationCategory) return null;

  return {
    id: medicationCategory.id,
    name: medicationCategory.name,
    description: medicationCategory.description ?? undefined,
    createdAt: medicationCategory.createdAt
  };
}

export async function findAll(
  filters: { term: string | undefined },
  page: number,
  limit: number,
  tx?: Prisma.TransactionClient
): Promise<{ medicationCategories: MedicationCategory[]; total: number }> {
  const client = tx ?? prisma;

  const where: Prisma.MedicationCategoryWhereInput = {
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

  const [medicationCategories, total] = await Promise.all([
    client.medicationCategory.findMany({
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
    client.medicationCategory.count({ where })
  ]);

  return {
    medicationCategories: medicationCategories.map((mc) => ({
      id: mc.id,
      name: mc.name,
      description: mc.description ?? undefined,
      createdAt: mc.createdAt
    })),
    total
  };
}

export async function update(
  id: string,
  data: UpdateMedicationCategoryDTO,
  tx?: Prisma.TransactionClient
): Promise<MedicationCategory> {
  const client = tx ?? prisma;

  const medicationCategory = await client.medicationCategory.update({
    where: { id },
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
    id: medicationCategory.id,
    name: medicationCategory.name,
    description: medicationCategory.description ?? undefined,
    createdAt: medicationCategory.createdAt
  };
}

export async function deleteById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.medicationCategory.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}
