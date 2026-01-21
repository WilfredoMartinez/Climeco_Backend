import {
  createNotFoundError,
  createBadRequestError,
  createForbiddenError
} from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as dentalHistoryRepository from '@/repositories/dentalHistory.repository';
import * as odontogramRepository from '@/repositories/odontogram.repository';
import * as patientRepository from '@/repositories/patient.repository';
import * as activityLogService from '@/services/activityLog.service';
import type {
  CreateDentalHistoryDTO,
  DentalHistory,
  UpdateDentalHistoryDTO,
  QueryDentalHistoriesDTO
} from '@/types/dentalHistory.types';

export async function createDentalHistory(
  data: CreateDentalHistoryDTO,
  doctorId: string
): Promise<DentalHistory> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que el paciente existe
    const patient = await patientRepository.findById(data.patientId);

    if (!patient) {
      throw createNotFoundError('Paciente no encontrado');
    }

    // Verificar que la cita existe
    const appointment = await tx.appointment.findFirst({
      where: {
        id: data.appointmentId,
        isActive: true,
        deletedAt: null
      }
    });

    if (!appointment) {
      throw createNotFoundError('Cita no encontrada');
    }

    // Verificar que la cita esté en un estado válido para crear historial
    if (
      appointment.status !== 'IN_PROGRESS' &&
      appointment.status !== 'READY' &&
      appointment.status !== 'COMPLETED'
    ) {
      throw createBadRequestError(
        'El historial dental solo puede crearse cuando la cita está en progreso, lista o completada'
      );
    }

    // Crear el historial dental
    const dentalHistory = await dentalHistoryRepository.create(
      data,
      doctorId,
      tx
    );

    // Crear el odontograma si se proporcionan los datos de los dientes
    if (data.teeth && data.teeth.length > 0) {
      await odontogramRepository.create(
        {
          dentalHistoryId: dentalHistory.id,
          teeth: data.teeth
        },
        tx
      );
    }

    // Registrar actividad
    await activityLogService.logActivity({
      userId: doctorId,
      action: 'DENTAL_HISTORY:CREATE',
      newValue: {
        dentalHistory,
        hasOdontogram: data.teeth && data.teeth.length > 0
      },
      tx
    });

    return dentalHistory;
  });
}

export async function getDentalHistoryById(id: string): Promise<DentalHistory> {
  const dentalHistory = await dentalHistoryRepository.findById(id);

  if (!dentalHistory) {
    throw createNotFoundError('Historial dental no encontrado');
  }

  return dentalHistory;
}

export async function getDentalHistoryByAppointmentId(
  appointmentId: string
): Promise<DentalHistory | null> {
  return await dentalHistoryRepository.findByAppointmentId(appointmentId);
}

export async function getDentalHistories(
  query: QueryDentalHistoriesDTO
): Promise<{ dentalHistories: DentalHistory[]; total: number }> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  return await dentalHistoryRepository.findAll(
    {
      patientId: query.patientId,
      doctorId: query.doctorId,
      appointmentId: query.appointmentId
    },
    page,
    limit
  );
}

export async function updateDentalHistory(
  id: string,
  data: UpdateDentalHistoryDTO,
  userId: string
): Promise<DentalHistory> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const existing = await dentalHistoryRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Historial dental no encontrado');
    }

    // Verificar que el usuario que actualiza es el doctor del historial
    if (existing.doctorId !== userId) {
      throw createForbiddenError(
        'Solo el doctor que creó el historial puede actualizarlo'
      );
    }

    // Actualizar el historial
    const dentalHistory = await dentalHistoryRepository.update(id, data, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'DENTAL_HISTORY:UPDATE',
      oldValue: { before: existing },
      newValue: { after: dentalHistory },
      tx
    });

    return dentalHistory;
  });
}

export async function deleteDentalHistory(
  id: string,
  userId: string
): Promise<void> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const dentalHistory = await dentalHistoryRepository.findById(id, tx);

    if (!dentalHistory) {
      throw createNotFoundError('Historial dental no encontrado');
    }

    // Verificar que el usuario que elimina es el doctor del historial
    if (dentalHistory.doctorId !== userId) {
      throw createForbiddenError(
        'Solo el doctor que creó el historial puede eliminarlo'
      );
    }

    // Eliminar (soft delete)
    await dentalHistoryRepository.remove(id, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'DENTAL_HISTORY:DELETE',
      oldValue: { dentalHistory },
      tx
    });
  });
}
