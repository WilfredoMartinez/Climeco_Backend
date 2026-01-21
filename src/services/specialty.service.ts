import type z from 'zod';

import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import * as specialtyRepository from '@/repositories/specialty.repository';
import type {
  createSpecialtySchema,
  getSpecialtiesQuerySchema,
  updateSpecialtySchema
} from '@/schemas/specialty.schema';
import { logActivity } from '@/services/activityLog.service';
import type { Specialty } from '@/types/specialty.types';

export async function createSpecialty(
  data: z.infer<typeof createSpecialtySchema>,
  userId: string
): Promise<Specialty> {
  const existingSpecialty = await specialtyRepository.findByName(data.name);

  if (existingSpecialty)
    throw createBadRequestError('Ya existe una especialidad con ese nombre');

  const specialtyData = {
    name: data.name,
    description: data.description ?? undefined,
    area: data.area
  };

  const newSpecialty = await specialtyRepository.create(specialtyData);

  await logActivity({
    userId,
    action: 'SPECIALTY:CREATE',
    newValue: { id: newSpecialty.id, name: newSpecialty.name }
  });

  return newSpecialty;
}

export async function getSpecialtyById(id: string): Promise<Specialty> {
  const specialty = await specialtyRepository.findById(id);

  if (!specialty) throw createNotFoundError('Especialidad no encontrada');

  return specialty;
}

export async function getAllSpecialties(
  query: z.infer<typeof getSpecialtiesQuerySchema>
): Promise<{ specialties: Specialty[]; total: number }> {
  const { page, limit, term, area } = query;

  const filters = {
    term,
    area
  };

  const { specialties, total } = await specialtyRepository.findAll(
    filters,
    Number(page),
    Number(limit)
  );

  return {
    specialties,
    total: Number(total)
  };
}

export async function updateSpecialty(
  id: string,
  data: z.infer<typeof updateSpecialtySchema>,
  userId: string
): Promise<Specialty> {
  const specialty = await specialtyRepository.findById(id);

  if (!specialty) throw createNotFoundError('Especialidad no encontrada');

  if (data.name && data.name !== specialty.name) {
    const existingSpecialty = await specialtyRepository.findByName(data.name);

    if (existingSpecialty)
      throw createBadRequestError('Ya existe una especialidad con ese nombre');
  }

  const updatedSpecialty = await specialtyRepository.update(id, data);

  await logActivity({
    userId,
    action: 'SPECIALTY:UPDATE',
    oldValue: { id: specialty.id, name: specialty.name },
    newValue: { id: updatedSpecialty.id, name: updatedSpecialty.name }
  });

  return updatedSpecialty;
}

export async function deleteSpecialty(
  id: string,
  userId: string
): Promise<void> {
  const specialty = await specialtyRepository.findById(id);

  if (!specialty) throw createNotFoundError('Especialidad no encontrada');

  await specialtyRepository.deleteById(id);

  await logActivity({
    userId,
    action: 'SPECIALTY:DELETE',
    oldValue: { id: specialty.id, name: specialty.name }
  });
}
