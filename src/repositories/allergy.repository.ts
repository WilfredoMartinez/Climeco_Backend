import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type {
  Allergy,
  CreateAllergyDTO,
  UpdateAllergyDTO
} from '@/types/allergy.types';

export async function create(
  data: CreateAllergyDTO,
  tx?: Prisma.TransactionClient
): Promise<Allergy> {
  const client = tx ?? prisma;

  const allergy = await client.allergy.create({
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
    id: allergy.id,
    name: allergy.name,
    description: allergy.description ?? undefined,
    createdAt: allergy.createdAt
  };
}

export async function findById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<Allergy | null> {
  const client = tx ?? prisma;

  const allergy = await client.allergy.findFirst({
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

  if (!allergy) return null;

  return {
    id: allergy.id,
    name: allergy.name,
    description: allergy.description ?? undefined,
    createdAt: allergy.createdAt
  };
}

export async function findByName(
  name: string,
  tx?: Prisma.TransactionClient
): Promise<Allergy | null> {
  const client = tx ?? prisma;

  const allergy = await client.allergy.findFirst({
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

  if (!allergy) return null;

  return {
    id: allergy.id,
    name: allergy.name,
    description: allergy.description ?? undefined,
    createdAt: allergy.createdAt
  };
}

export async function findAll(
  filters: { term: string | undefined },
  page: number,
  limit: number,
  tx?: Prisma.TransactionClient
): Promise<{ allergies: Allergy[]; total: number }> {
  const client = tx ?? prisma;

  const where: Prisma.AllergyWhereInput = {
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

  const [allergies, total] = await Promise.all([
    client.allergy.findMany({
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
    client.allergy.count({ where })
  ]);

  return {
    allergies: allergies.map((allergy) => ({
      id: allergy.id,
      name: allergy.name,
      description: allergy.description ?? undefined,
      createdAt: allergy.createdAt
    })),
    total
  };
}

export async function update(
  id: string,
  data: UpdateAllergyDTO,
  tx?: Prisma.TransactionClient
): Promise<Allergy> {
  const client = tx ?? prisma;

  const allergy = await client.allergy.update({
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
    id: allergy.id,
    name: allergy.name,
    description: allergy.description ?? undefined,
    createdAt: allergy.createdAt
  };
}

export async function deleteById(
  id: string,
  tx?: Prisma.TransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.allergy.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
      updatedAt: new Date()
    }
  });
}
