import type z from 'zod';

import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import * as medicationCategoryRepository from '@/repositories/medicationCategory.repository';
import type {
  createMedicationCategorySchema,
  getMedicationCategoriesQuerySchema,
  updateMedicationCategorySchema
} from '@/schemas/medicationCategory.schema';
import { logActivity } from '@/services/activityLog.service';
import type { MedicationCategory } from '@/types/medicationCategory.types';

export async function createMedicationCategory(
  data: z.infer<typeof createMedicationCategorySchema>,
  userId: string
): Promise<MedicationCategory> {
  const existingCategory = await medicationCategoryRepository.findByName(
    data.name
  );

  if (existingCategory)
    throw createBadRequestError('Ya existe una categoría con ese nombre');

  const categoryData = {
    name: data.name,
    description: data.description ?? undefined
  };

  const newCategory = await medicationCategoryRepository.create(categoryData);

  await logActivity({
    userId,
    action: 'MEDICATION_CATEGORY:CREATE',
    newValue: { id: newCategory.id, name: newCategory.name }
  });

  return newCategory;
}

export async function getMedicationCategoryById(
  id: string
): Promise<MedicationCategory> {
  const category = await medicationCategoryRepository.findById(id);

  if (!category)
    throw createNotFoundError('Categoría de medicamento no encontrada');

  return category;
}

export async function getAllMedicationCategories(
  query: z.infer<typeof getMedicationCategoriesQuerySchema>
): Promise<{ medicationCategories: MedicationCategory[]; total: number }> {
  const { page, limit, term } = query;

  const filters = {
    term
  };

  const { medicationCategories, total } =
    await medicationCategoryRepository.findAll(
      filters,
      Number(page),
      Number(limit)
    );

  return {
    medicationCategories,
    total: Number(total)
  };
}

export async function updateMedicationCategory(
  id: string,
  data: z.infer<typeof updateMedicationCategorySchema>,
  userId: string
): Promise<MedicationCategory> {
  const category = await medicationCategoryRepository.findById(id);

  if (!category)
    throw createNotFoundError('Categoría de medicamento no encontrada');

  if (data.name && data.name !== category.name) {
    const existingCategory = await medicationCategoryRepository.findByName(
      data.name
    );

    if (existingCategory)
      throw createBadRequestError('Ya existe una categoría con ese nombre');
  }

  const updatedCategory = await medicationCategoryRepository.update(id, data);

  await logActivity({
    userId,
    action: 'MEDICATION_CATEGORY:UPDATE',
    oldValue: { id: category.id, name: category.name },
    newValue: { id: updatedCategory.id, name: updatedCategory.name }
  });

  return updatedCategory;
}

export async function deleteMedicationCategory(
  id: string,
  userId: string
): Promise<void> {
  const category = await medicationCategoryRepository.findById(id);

  if (!category)
    throw createNotFoundError('Categoría de medicamento no encontrada');

  await medicationCategoryRepository.deleteById(id);

  await logActivity({
    userId,
    action: 'MEDICATION_CATEGORY:DELETE',
    oldValue: { id: category.id, name: category.name }
  });
}
