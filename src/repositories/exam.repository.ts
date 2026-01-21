import type { Prisma } from '@prisma/client';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type { CreateExamDTO, Exam, UpdateExamDTO } from '@/types/exam.types';

export async function create(
  data: CreateExamDTO,
  userId: string,
  tx?: PrismaTransactionClient
): Promise<Exam> {
  const client = tx ?? prisma;

  const exam = await client.exam.create({
    data: {
      userId,
      patientId: data.patientId,
      examTypeId: data.examTypeId,
      scheduledAt: data.scheduledAt,
      status: data.status ?? 'PENDING',
      notes: data.notes ?? null
    },
    select: {
      id: true,
      userId: true,
      patientId: true,
      examTypeId: true,
      scheduledAt: true,
      status: true,
      notes: true,
      createdAt: true
    }
  });

  return {
    id: exam.id,
    userId: exam.userId,
    patientId: exam.patientId,
    examTypeId: exam.examTypeId,
    scheduledAt: exam.scheduledAt,
    status: exam.status as 'PENDING' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED',
    notes: exam.notes ?? undefined,
    createdAt: exam.createdAt
  };
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<Exam | null> {
  const client = tx ?? prisma;

  const exam = await client.exam.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      userId: true,
      patientId: true,
      examTypeId: true,
      scheduledAt: true,
      status: true,
      notes: true,
      createdAt: true
    }
  });

  if (!exam) return null;

  return {
    id: exam.id,
    userId: exam.userId,
    patientId: exam.patientId,
    examTypeId: exam.examTypeId,
    scheduledAt: exam.scheduledAt,
    status: exam.status as 'PENDING' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED',
    notes: exam.notes ?? undefined,
    createdAt: exam.createdAt
  };
}

export async function findAll(
  filters: {
    patientId: string | undefined;
    examTypeId: string | undefined;
    userId: string | undefined;
    status: 'PENDING' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED' | undefined;
    term: string | undefined;
  },
  page: number,
  limit: number,
  tx?: PrismaTransactionClient
): Promise<{ exams: Exam[]; total: number }> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where: Prisma.ExamWhereInput = {
    isActive: true,
    deletedAt: null
  };

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.examTypeId) {
    where.examTypeId = filters.examTypeId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.term) {
    where.notes = { contains: filters.term, mode: 'insensitive' };
  }

  const [data, total] = await Promise.all([
    client.exam.findMany({
      where,
      select: {
        id: true,
        userId: true,
        patientId: true,
        examTypeId: true,
        scheduledAt: true,
        status: true,
        notes: true,
        createdAt: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            documentType: true,
            documentNumber: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            email: true,
            medicalRecordNumber: true
          }
        },
        examType: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            durationTimeUnit: true,
            category: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: { scheduledAt: 'desc' }
    }),
    client.exam.count({ where })
  ]);

  const exams = data.map((exam) => ({
    id: exam.id,
    userId: exam.userId,
    patientId: exam.patientId,
    examTypeId: exam.examTypeId,
    scheduledAt: exam.scheduledAt,
    status: exam.status as 'PENDING' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED',
    notes: exam.notes ?? undefined,
    createdAt: exam.createdAt,
    patient: exam.patient
      ? {
          id: exam.patient.id,
          firstName: exam.patient.firstName,
          lastName: exam.patient.lastName,
          documentType: exam.patient.documentType,
          documentNumber: exam.patient.documentNumber,
          dateOfBirth: exam.patient.dateOfBirth,
          gender: exam.patient.gender,
          phone: exam.patient.phone ?? undefined,
          email: exam.patient.email ?? undefined,
          medicalRecordNumber: exam.patient.medicalRecordNumber
        }
      : undefined,
    examType: exam.examType
      ? {
          id: exam.examType.id,
          name: exam.examType.name,
          description: exam.examType.description ?? undefined,
          price: exam.examType.price,
          duration: exam.examType.duration,
          durationTimeUnit: exam.examType.durationTimeUnit,
          category: {
            id: exam.examType.category.id,
            name: exam.examType.category.name,
            description: exam.examType.category.description ?? undefined
          }
        }
      : undefined
  }));

  return { exams, total };
}

export async function update(
  id: string,
  data: UpdateExamDTO,
  tx?: PrismaTransactionClient
): Promise<Exam> {
  const client = tx ?? prisma;

  const updateData: Prisma.ExamUpdateInput = {};

  if (data.patientId !== undefined) {
    updateData.patient = {
      connect: { id: data.patientId }
    };
  }

  if (data.examTypeId !== undefined) {
    updateData.examType = {
      connect: { id: data.examTypeId }
    };
  }

  if (data.scheduledAt !== undefined) {
    updateData.scheduledAt = data.scheduledAt;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.notes !== undefined) {
    updateData.notes = data.notes;
  }

  const exam = await client.exam.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      userId: true,
      patientId: true,
      examTypeId: true,
      scheduledAt: true,
      status: true,
      notes: true,
      createdAt: true
    }
  });

  return {
    id: exam.id,
    userId: exam.userId,
    patientId: exam.patientId,
    examTypeId: exam.examTypeId,
    scheduledAt: exam.scheduledAt,
    status: exam.status as 'PENDING' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED',
    notes: exam.notes ?? undefined,
    createdAt: exam.createdAt
  };
}

export async function remove(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.exam.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}
