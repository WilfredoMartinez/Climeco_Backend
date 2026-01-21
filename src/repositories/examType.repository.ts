import type { Prisma } from '@prisma/client';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  CreateExamTypeDTO,
  ExamType,
  UpdateExamTypeDTO
} from '@/types/examType.types';

export async function create(
  data: CreateExamTypeDTO,
  tx?: PrismaTransactionClient
): Promise<ExamType> {
  const client = tx ?? prisma;

  const examType = await client.examType.create({
    data: {
      examCategoryId: data.examCategoryId,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      duration: data.duration,
      durationTimeUnit: data.durationTimeUnit
    },
    select: {
      id: true,
      examCategoryId: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      durationTimeUnit: true,
      createdAt: true
    }
  });

  return {
    id: examType.id,
    examCategoryId: examType.examCategoryId,
    name: examType.name,
    description: examType.description ?? undefined,
    price: examType.price,
    duration: examType.duration,
    durationTimeUnit: examType.durationTimeUnit as 'MINUTES' | 'HOURS' | 'DAYS',
    createdAt: examType.createdAt
  };
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<ExamType | null> {
  const client = tx ?? prisma;

  const examType = await client.examType.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      examCategoryId: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      durationTimeUnit: true,
      createdAt: true
    }
  });

  if (!examType) return null;

  return {
    id: examType.id,
    examCategoryId: examType.examCategoryId,
    name: examType.name,
    description: examType.description ?? undefined,
    price: examType.price,
    duration: examType.duration,
    durationTimeUnit: examType.durationTimeUnit as 'MINUTES' | 'HOURS' | 'DAYS',
    createdAt: examType.createdAt
  };
}

export async function findByName(
  name: string,
  tx?: PrismaTransactionClient
): Promise<ExamType | null> {
  const client = tx ?? prisma;

  const examType = await client.examType.findFirst({
    where: {
      name,
      deletedAt: null
    },
    select: {
      id: true,
      examCategoryId: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      durationTimeUnit: true,
      createdAt: true
    }
  });

  if (!examType) return null;

  return {
    id: examType.id,
    examCategoryId: examType.examCategoryId,
    name: examType.name,
    description: examType.description ?? undefined,
    price: examType.price,
    duration: examType.duration,
    durationTimeUnit: examType.durationTimeUnit as 'MINUTES' | 'HOURS' | 'DAYS',
    createdAt: examType.createdAt
  };
}

export async function findAll(
  filters: { examCategoryId: string | undefined; term: string | undefined },
  page: number,
  limit: number,
  tx?: PrismaTransactionClient
): Promise<{ examTypes: ExamType[]; total: number }> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where: Prisma.ExamTypeWhereInput = {
    isActive: true,
    deletedAt: null
  };

  if (filters.examCategoryId) {
    where.examCategoryId = filters.examCategoryId;
  }

  if (filters.term) {
    where.OR = [
      { name: { contains: filters.term, mode: 'insensitive' } },
      { description: { contains: filters.term, mode: 'insensitive' } }
    ];
  }

  const [data, total] = await Promise.all([
    client.examType.findMany({
      where,
      select: {
        id: true,
        examCategoryId: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        durationTimeUnit: true,
        createdAt: true
      },
      skip,
      take: limit,
      orderBy: { name: 'asc' }
    }),
    client.examType.count({ where })
  ]);

  const examTypes = data.map((examType) => ({
    id: examType.id,
    examCategoryId: examType.examCategoryId,
    name: examType.name,
    description: examType.description ?? undefined,
    price: examType.price,
    duration: examType.duration,
    durationTimeUnit: examType.durationTimeUnit as 'MINUTES' | 'HOURS' | 'DAYS',
    createdAt: examType.createdAt
  }));

  return { examTypes, total };
}

export async function update(
  id: string,
  data: UpdateExamTypeDTO,
  tx?: PrismaTransactionClient
): Promise<ExamType> {
  const client = tx ?? prisma;

  const updateData: Prisma.ExamTypeUpdateInput = {};

  if (data.examCategoryId !== undefined) {
    updateData.category = {
      connect: { id: data.examCategoryId }
    };
  }

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.price !== undefined) {
    updateData.price = data.price;
  }

  if (data.duration !== undefined) {
    updateData.duration = data.duration;
  }

  if (data.durationTimeUnit !== undefined) {
    updateData.durationTimeUnit = data.durationTimeUnit;
  }

  const examType = await client.examType.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      examCategoryId: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      durationTimeUnit: true,
      createdAt: true
    }
  });

  return {
    id: examType.id,
    examCategoryId: examType.examCategoryId,
    name: examType.name,
    description: examType.description ?? undefined,
    price: examType.price,
    duration: examType.duration,
    durationTimeUnit: examType.durationTimeUnit as 'MINUTES' | 'HOURS' | 'DAYS',
    createdAt: examType.createdAt
  };
}

export async function remove(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.examType.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}
