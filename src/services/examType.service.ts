import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as examCategoryRepository from '@/repositories/examCategory.repository';
import * as examTypeRepository from '@/repositories/examType.repository';
import * as activityLogService from '@/services/activityLog.service';
import type {
  CreateExamTypeDTO,
  ExamType,
  UpdateExamTypeDTO,
  QueryExamTypesDTO
} from '@/types/examType.types';

export async function createExamType(
  data: CreateExamTypeDTO,
  userId: string
): Promise<ExamType> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que la categoría de examen existe
    const examCategory = await examCategoryRepository.findById(
      data.examCategoryId,
      tx
    );

    if (!examCategory) {
      throw createNotFoundError('Categoría de examen no encontrada');
    }

    // Verificar que el nombre no exista
    const existing = await examTypeRepository.findByName(data.name, tx);

    if (existing) {
      throw createBadRequestError('Ya existe un tipo de examen con ese nombre');
    }

    // Crear el tipo de examen
    const examType = await examTypeRepository.create(data, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'EXAM_TYPE:CREATE',
      newValue: { examType },
      tx
    });

    return examType;
  });
}

export async function getExamTypeById(id: string): Promise<ExamType> {
  const examType = await examTypeRepository.findById(id);

  if (!examType) {
    throw createNotFoundError('Tipo de examen no encontrado');
  }

  return examType;
}

export async function getExamTypes(
  query: QueryExamTypesDTO
): Promise<{ examTypes: ExamType[]; total: number }> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  return await examTypeRepository.findAll(
    {
      examCategoryId: query.examCategoryId,
      term: query.term
    },
    page,
    limit
  );
}

export async function updateExamType(
  id: string,
  data: UpdateExamTypeDTO,
  userId: string
): Promise<ExamType> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const existing = await examTypeRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Tipo de examen no encontrado');
    }

    // Si se está cambiando la categoría, verificar que existe
    if (
      data.examCategoryId &&
      data.examCategoryId !== existing.examCategoryId
    ) {
      const examCategory = await examCategoryRepository.findById(
        data.examCategoryId,
        tx
      );

      if (!examCategory) {
        throw createNotFoundError('Categoría de examen no encontrada');
      }
    }

    // Si se está cambiando el nombre, verificar que no exista
    if (data.name && data.name !== existing.name) {
      const duplicate = await examTypeRepository.findByName(data.name, tx);

      if (duplicate) {
        throw createBadRequestError(
          'Ya existe un tipo de examen con ese nombre'
        );
      }
    }

    // Actualizar el tipo de examen
    const examType = await examTypeRepository.update(id, data, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'EXAM_TYPE:UPDATE',
      oldValue: { before: existing },
      newValue: { after: examType },
      tx
    });

    return examType;
  });
}

export async function deleteExamType(
  id: string,
  userId: string
): Promise<void> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const examType = await examTypeRepository.findById(id, tx);

    if (!examType) {
      throw createNotFoundError('Tipo de examen no encontrado');
    }

    // Eliminar (soft delete)
    await examTypeRepository.remove(id, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'EXAM_TYPE:DELETE',
      oldValue: { examType },
      tx
    });
  });
}
