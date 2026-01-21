import type z from 'zod';

import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import * as examCategoryRepository from '@/repositories/examCategory.repository';
import type {
  createExamCategorySchema,
  getExamCategoriesQuerySchema,
  updateExamCategorySchema
} from '@/schemas/examCategory.schema';
import { logActivity } from '@/services/activityLog.service';
import type { ExamCategory } from '@/types/examCategory.types';

export async function createExamCategory(
  data: z.infer<typeof createExamCategorySchema>,
  userId: string
): Promise<ExamCategory> {
  const existingCategory = await examCategoryRepository.findByName(data.name);

  if (existingCategory) {
    throw createBadRequestError(
      'Ya existe una categoría de examen con ese nombre'
    );
  }

  const categoryData = {
    name: data.name,
    description: data.description ?? undefined
  };

  const newCategory = await examCategoryRepository.create(categoryData);

  await logActivity({
    userId,
    action: 'EXAM_CATEGORY:CREATE',
    newValue: { id: newCategory.id, name: newCategory.name }
  });

  return newCategory;
}

export async function getExamCategoryById(id: string): Promise<ExamCategory> {
  const category = await examCategoryRepository.findById(id);

  if (!category) {
    throw createNotFoundError('Categoría de examen no encontrada');
  }

  return category;
}

export async function getAllExamCategories(
  query: z.infer<typeof getExamCategoriesQuerySchema>
): Promise<{ examCategories: ExamCategory[]; total: number }> {
  const { page, limit, term } = query;

  const filters = {
    term
  };

  const { examCategories, total } = await examCategoryRepository.findAll(
    filters,
    Number(page),
    Number(limit)
  );

  return {
    examCategories,
    total: Number(total)
  };
}

export async function updateExamCategory(
  id: string,
  data: z.infer<typeof updateExamCategorySchema>,
  userId: string
): Promise<ExamCategory> {
  const category = await examCategoryRepository.findById(id);

  if (!category) {
    throw createNotFoundError('Categoría de examen no encontrada');
  }

  if (data.name && data.name !== category.name) {
    const existingCategory = await examCategoryRepository.findByName(data.name);

    if (existingCategory) {
      throw createBadRequestError(
        'Ya existe una categoría de examen con ese nombre'
      );
    }
  }

  const updateData = {
    name: data.name,
    description: data.description
  };

  const updatedCategory = await examCategoryRepository.update(id, updateData);

  await logActivity({
    userId,
    action: 'EXAM_CATEGORY:UPDATE',
    oldValue: { id: category.id, name: category.name },
    newValue: { id: updatedCategory.id, name: updatedCategory.name }
  });

  return updatedCategory;
}

export async function deleteExamCategory(
  id: string,
  userId: string
): Promise<void> {
  const category = await examCategoryRepository.findById(id);

  if (!category) {
    throw createNotFoundError('Categoría de examen no encontrada');
  }

  await examCategoryRepository.remove(id);

  await logActivity({
    userId,
    action: 'EXAM_CATEGORY:DELETE',
    oldValue: { id: category.id, name: category.name }
  });
}
