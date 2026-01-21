import type { Prisma } from '@prisma/client';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  CreateExamCategoryDTO,
  ExamCategory,
  UpdateExamCategoryDTO
} from '@/types/examCategory.types';

export async function create(
  data: CreateExamCategoryDTO,
  tx?: PrismaTransactionClient
): Promise<ExamCategory> {
  const client = tx ?? prisma;

  const examCategory = await client.examCategory.create({
    data: {
      name: data.name,
      description: data.description ?? null
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true
    }
  });

  return {
    id: examCategory.id,
    name: examCategory.name,
    description: examCategory.description ?? undefined,
    createdAt: examCategory.createdAt
  };
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<ExamCategory | null> {
  const client = tx ?? prisma;

  const examCategory = await client.examCategory.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true
    }
  });

  if (!examCategory) return null;

  return {
    id: examCategory.id,
    name: examCategory.name,
    description: examCategory.description ?? undefined,
    createdAt: examCategory.createdAt
  };
}

export async function findByName(
  name: string,
  tx?: PrismaTransactionClient
): Promise<ExamCategory | null> {
  const client = tx ?? prisma;

  const examCategory = await client.examCategory.findFirst({
    where: {
      name,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true
    }
  });

  if (!examCategory) return null;

  return {
    id: examCategory.id,
    name: examCategory.name,
    description: examCategory.description ?? undefined,
    createdAt: examCategory.createdAt
  };
}

export async function findAll(
  filters: { term: string | undefined },
  page: number,
  limit: number,
  tx?: PrismaTransactionClient
): Promise<{ examCategories: ExamCategory[]; total: number }> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where: Prisma.ExamCategoryWhereInput = {
    isActive: true,
    deletedAt: null
  };

  if (filters.term) {
    where.OR = [
      { name: { contains: filters.term, mode: 'insensitive' } },
      { description: { contains: filters.term, mode: 'insensitive' } }
    ];
  }

  const [data, total] = await Promise.all([
    client.examCategory.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' }
    }),
    client.examCategory.count({ where })
  ]);

  const examCategories = data.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description ?? undefined,
    createdAt: category.createdAt
  }));

  return { examCategories, total };
}

export async function update(
  id: string,
  data: UpdateExamCategoryDTO,
  tx?: PrismaTransactionClient
): Promise<ExamCategory> {
  const client = tx ?? prisma;

  const updateData: Prisma.ExamCategoryUpdateInput = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  const examCategory = await client.examCategory.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true
    }
  });

  return {
    id: examCategory.id,
    name: examCategory.name,
    description: examCategory.description ?? undefined,
    createdAt: examCategory.createdAt
  };
}

export async function remove(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.examCategory.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}
