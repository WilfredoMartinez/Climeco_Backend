import { createNotFoundError, createBadRequestError } from '@/lib/errors';
import * as medicationRepository from '@/repositories/medication.repository';
import type {
  Medication,
  CreateMedicationDTO,
  UpdateMedicationDTO,
  GetMedicationsQueryDTO,
  PaginatedMedications
} from '@/types/medication.types';

/**
 * Crear un medicamento
 */
export const createMedication = async (
  data: CreateMedicationDTO
): Promise<Medication> => {
  // Verificar que la categoría exista
  const categoryExistsCheck = await medicationRepository.categoryExists(
    data.categoryId
  );
  if (!categoryExistsCheck) {
    throw createNotFoundError('La categoría especificada no existe');
  }

  // Verificar que el nombre no esté en uso
  const nameExists = await medicationRepository.medicationExistsByName(
    data.name
  );
  if (nameExists) {
    throw createBadRequestError('Ya existe un medicamento con ese nombre');
  }

  // Verificar que el código no esté en uso
  const codeExists = await medicationRepository.medicationExistsByCode(
    data.code
  );
  if (codeExists) {
    throw createBadRequestError('Ya existe un medicamento con ese código');
  }

  return await medicationRepository.createMedication(data);
};

/**
 * Obtener medicamentos con paginación y filtros
 */
export const getMedications = async (
  query: GetMedicationsQueryDTO
): Promise<PaginatedMedications> => {
  const { data, total } = await medicationRepository.getMedications(query);

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    }
  };
};

/**
 * Obtener un medicamento por ID
 */
export const getMedicationById = async (id: string): Promise<Medication> => {
  const medication = await medicationRepository.getMedicationById(id);

  if (!medication) {
    throw createNotFoundError('Medicamento no encontrado');
  }

  return medication;
};

/**
 * Actualizar un medicamento
 */
export const updateMedication = async (
  id: string,
  data: UpdateMedicationDTO
): Promise<Medication> => {
  // Verificar que el medicamento exista
  const medication = await medicationRepository.getMedicationById(id);
  if (!medication) {
    throw createNotFoundError('Medicamento no encontrado');
  }

  // Si se actualiza la categoría, verificar que exista
  if (data.categoryId) {
    const categoryExistsCheck = await medicationRepository.categoryExists(
      data.categoryId
    );
    if (!categoryExistsCheck) {
      throw createNotFoundError('La categoría especificada no existe');
    }
  }

  // Si se actualiza el nombre, verificar que no esté en uso
  if (data.name) {
    const nameExists = await medicationRepository.medicationExistsByName(
      data.name,
      id
    );
    if (nameExists) {
      throw createBadRequestError('Ya existe un medicamento con ese nombre');
    }
  }

  // Si se actualiza el código, verificar que no esté en uso
  if (data.code) {
    const codeExists = await medicationRepository.medicationExistsByCode(
      data.code,
      id
    );
    if (codeExists) {
      throw createBadRequestError('Ya existe un medicamento con ese código');
    }
  }

  return await medicationRepository.updateMedication(id, data);
};

/**
 * Eliminar un medicamento
 */
export const deleteMedication = async (id: string): Promise<void> => {
  // Verificar que el medicamento exista
  const medication = await medicationRepository.getMedicationById(id);
  if (!medication) {
    throw createNotFoundError('Medicamento no encontrado');
  }

  await medicationRepository.deleteMedication(id);
};
