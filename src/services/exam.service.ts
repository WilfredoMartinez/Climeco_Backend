import { createNotFoundError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as examRepository from '@/repositories/exam.repository';
import * as examTypeRepository from '@/repositories/examType.repository';
import * as patientRepository from '@/repositories/patient.repository';
import * as activityLogService from '@/services/activityLog.service';
import type {
  CreateExamDTO,
  Exam,
  UpdateExamDTO,
  QueryExamsDTO
} from '@/types/exam.types';

export async function createExam(
  data: CreateExamDTO,
  userId: string
): Promise<Exam> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que el paciente existe
    const patient = await patientRepository.findById(data.patientId);

    if (!patient) {
      throw createNotFoundError('Paciente no encontrado');
    }

    // Verificar que el tipo de examen existe
    const examType = await examTypeRepository.findById(data.examTypeId, tx);

    if (!examType) {
      throw createNotFoundError('Tipo de examen no encontrado');
    }

    // Crear el examen
    const exam = await examRepository.create(data, userId, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'EXAM:CREATE',
      newValue: { exam },
      tx
    });

    return exam;
  });
}

export async function getExamById(id: string): Promise<Exam> {
  const exam = await examRepository.findById(id);

  if (!exam) {
    throw createNotFoundError('Examen no encontrado');
  }

  return exam;
}

export async function getExams(
  query: QueryExamsDTO
): Promise<{ exams: Exam[]; total: number }> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  return await examRepository.findAll(
    {
      patientId: query.patientId,
      examTypeId: query.examTypeId,
      userId: query.userId,
      status: query.status,
      term: query.term
    },
    page,
    limit
  );
}

export async function updateExam(
  id: string,
  data: UpdateExamDTO,
  userId: string
): Promise<Exam> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const existing = await examRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Examen no encontrado');
    }

    // Si se está cambiando el paciente, verificar que existe
    if (data.patientId && data.patientId !== existing.patientId) {
      const patient = await patientRepository.findById(data.patientId);

      if (!patient) {
        throw createNotFoundError('Paciente no encontrado');
      }
    }

    // Si se está cambiando el tipo de examen, verificar que existe
    if (data.examTypeId && data.examTypeId !== existing.examTypeId) {
      const examType = await examTypeRepository.findById(data.examTypeId, tx);

      if (!examType) {
        throw createNotFoundError('Tipo de examen no encontrado');
      }
    }

    // Actualizar el examen
    const exam = await examRepository.update(id, data, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'EXAM:UPDATE',
      oldValue: { before: existing },
      newValue: { after: exam },
      tx
    });

    return exam;
  });
}

export async function deleteExam(id: string, userId: string): Promise<void> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const exam = await examRepository.findById(id, tx);

    if (!exam) {
      throw createNotFoundError('Examen no encontrado');
    }

    // Eliminar (soft delete)
    await examRepository.remove(id, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'EXAM:DELETE',
      oldValue: { exam },
      tx
    });
  });
}
