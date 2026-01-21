import type z from 'zod';

import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import * as allergyRepository from '@/repositories/allergy.repository';
import type {
  createAllergySchema,
  getAllergiesQuerySchema,
  updateAllergySchema
} from '@/schemas/allergy.schema';
import { logActivity } from '@/services/activityLog.service';
import type { Allergy } from '@/types/allergy.types';

export async function createAllergy(
  data: z.infer<typeof createAllergySchema>,
  userId: string
): Promise<Allergy> {
  const existingAllergy = await allergyRepository.findByName(data.name);

  if (existingAllergy)
    throw createBadRequestError('Ya existe una alergia con ese nombre');

  const allergyData = {
    name: data.name,
    description: data.description ?? undefined
  };

  const newAllergy = await allergyRepository.create(allergyData);

  await logActivity({
    userId,
    action: 'ALLERGY:CREATE',
    newValue: { id: newAllergy.id, name: newAllergy.name }
  });

  return newAllergy;
}

export async function getAllergyById(id: string): Promise<Allergy> {
  const allergy = await allergyRepository.findById(id);

  if (!allergy) throw createNotFoundError('Alergia no encontrada');

  return allergy;
}

export async function getAllAllergies(
  query: z.infer<typeof getAllergiesQuerySchema>
): Promise<{ allergies: Allergy[]; total: number }> {
  const { page, limit, term } = query;

  const filters = {
    term
  };

  const { allergies, total } = await allergyRepository.findAll(
    filters,
    Number(page),
    Number(limit)
  );

  return {
    allergies,
    total: Number(total)
  };
}

export async function updateAllergy(
  id: string,
  data: z.infer<typeof updateAllergySchema>,
  userId: string
): Promise<Allergy> {
  const allergy = await allergyRepository.findById(id);

  if (!allergy) throw createNotFoundError('Alergia no encontrada');

  if (data.name && data.name !== allergy.name) {
    const existingAllergy = await allergyRepository.findByName(data.name);

    if (existingAllergy)
      throw createBadRequestError('Ya existe una alergia con ese nombre');
  }

  const updatedAllergy = await allergyRepository.update(id, data);

  await logActivity({
    userId,
    action: 'ALLERGY:UPDATE',
    oldValue: { id: allergy.id, name: allergy.name },
    newValue: { id: updatedAllergy.id, name: updatedAllergy.name }
  });

  return updatedAllergy;
}

export async function deleteAllergy(id: string, userId: string): Promise<void> {
  const allergy = await allergyRepository.findById(id);

  if (!allergy) throw createNotFoundError('Alergia no encontrada');

  await allergyRepository.deleteById(id);

  await logActivity({
    userId,
    action: 'ALLERGY:DELETE',
    oldValue: { id: allergy.id, name: allergy.name }
  });
}
