import { createNotFoundError } from '@/lib/errors';
import * as dentalHistoryRepository from '@/repositories/dentalHistory.repository';
import * as odontogramRepository from '@/repositories/odontogram.repository';
import * as activityLogService from '@/services/activityLog.service';
import type {
  CreateOdontogramDTO,
  Odontogram,
  UpdateOdontogramDTO,
  UpdateToothDTO
} from '@/types/odontogram.types';

export async function createOdontogram(
  data: CreateOdontogramDTO,
  userId: string
): Promise<Odontogram> {
  // Verificar que el historial dental existe
  const dentalHistory = await dentalHistoryRepository.findById(
    data.dentalHistoryId
  );

  if (!dentalHistory) {
    throw createNotFoundError('Historial dental no encontrado');
  }

  // Verificar que no existe ya un odontograma para este historial
  const existingOdontogram = await odontogramRepository.findByDentalHistoryId(
    data.dentalHistoryId
  );

  if (existingOdontogram) {
    throw new Error('Ya existe un odontograma para este historial dental');
  }

  const odontogram = await odontogramRepository.create(data);

  // Registrar actividad
  await activityLogService.logActivity({
    userId,
    action: 'CREATE_ODONTOGRAM',
    newValue: {
      id: odontogram.id,
      dentalHistoryId: data.dentalHistoryId,
      teethCount: data.teeth.length
    }
  });

  return odontogram;
}

export async function getOdontogramByDentalHistoryId(
  dentalHistoryId: string
): Promise<Odontogram> {
  const odontogram =
    await odontogramRepository.findByDentalHistoryId(dentalHistoryId);

  if (!odontogram) {
    throw createNotFoundError('Odontograma no encontrado');
  }

  return odontogram;
}

export async function getOdontogramById(id: string): Promise<Odontogram> {
  const odontogram = await odontogramRepository.findById(id);

  if (!odontogram) {
    throw createNotFoundError('Odontograma no encontrado');
  }

  return odontogram;
}

export async function updateOdontogram(
  id: string,
  data: UpdateOdontogramDTO,
  userId: string
): Promise<Odontogram> {
  const existingOdontogram = await odontogramRepository.findById(id);

  if (!existingOdontogram) {
    throw createNotFoundError('Odontograma no encontrado');
  }

  const updatedOdontogram = await odontogramRepository.update(id, data);

  // Registrar actividad
  await activityLogService.logActivity({
    userId,
    action: 'UPDATE_ODONTOGRAM',
    newValue: {
      id,
      teethCount: data.teeth.length
    }
  });

  return updatedOdontogram;
}

export async function updateToothInOdontogram(
  odontogramId: string,
  toothId: string,
  data: UpdateToothDTO,
  userId: string
): Promise<Odontogram> {
  const existingOdontogram = await odontogramRepository.findById(odontogramId);

  if (!existingOdontogram) {
    throw createNotFoundError('Odontograma no encontrado');
  }

  // Verificar que el diente existe en este odontograma
  const tooth = existingOdontogram.teeth.find((t) => t.id === toothId);

  if (!tooth) {
    throw createNotFoundError('Diente no encontrado en este odontograma');
  }

  const updatedOdontogram = await odontogramRepository.updateTooth(
    odontogramId,
    toothId,
    data
  );

  // Registrar actividad
  await activityLogService.logActivity({
    userId,
    action: 'UPDATE_TOOTH',
    newValue: {
      toothId,
      toothNumber: tooth.toothNumber,
      ...data
    }
  });

  return updatedOdontogram;
}

export async function deleteOdontogram(
  id: string,
  userId: string
): Promise<void> {
  const existingOdontogram = await odontogramRepository.findById(id);

  if (!existingOdontogram) {
    throw createNotFoundError('Odontograma no encontrado');
  }

  await odontogramRepository.remove(id);

  // Registrar actividad
  await activityLogService.logActivity({
    userId,
    action: 'DELETE_ODONTOGRAM',
    oldValue: {
      id,
      dentalHistoryId: existingOdontogram.dentalHistoryId
    }
  });
}
