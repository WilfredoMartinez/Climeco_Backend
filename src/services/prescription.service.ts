import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as medicationRepository from '@/repositories/medication.repository';
import * as patientRepository from '@/repositories/patient.repository';
import * as prescriptionRepository from '@/repositories/prescription.repository';
import * as activityLogService from '@/services/activityLog.service';
import type {
  CreatePrescriptionDTO,
  Prescription
} from '@/types/prescription.types';

export async function createPrescription(
  data: CreatePrescriptionDTO,
  doctorId: string
): Promise<Prescription> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que el paciente existe
    const patient = await patientRepository.findById(data.patientId);

    if (!patient) {
      throw createNotFoundError('Paciente no encontrado');
    }

    // Verificar que todos los medicamentos existen y tienen stock suficiente
    for (const item of data.items) {
      const medication = await medicationRepository.getMedicationById(
        item.medicationId
      );

      if (!medication) {
        throw createNotFoundError(
          `Medicamento con ID ${item.medicationId} no encontrado`
        );
      }

      if (medication.stock < item.quantity) {
        throw createBadRequestError(
          `Stock insuficiente para ${medication.name}. Stock disponible: ${medication.stock}, solicitado: ${item.quantity}`
        );
      }
    }

    // Crear la receta
    const prescription = await prescriptionRepository.create(
      data,
      doctorId,
      tx
    );

    // Descargar los medicamentos del inventario
    await prescriptionRepository.dischargeMedications(
      prescription.prescriptionItems!,
      tx
    );

    // Registrar actividad
    await activityLogService.logActivity({
      userId: doctorId,
      action: 'PRESCRIPTION:CREATE',
      newValue: {
        prescription
      },
      tx
    });

    return prescription;
  });
}

export async function getPrescriptionById(id: string): Promise<Prescription> {
  const prescription = await prescriptionRepository.findById(id);

  if (!prescription) {
    throw createNotFoundError('Receta no encontrada');
  }

  return prescription;
}

export async function getPrescriptionsByPatient(
  patientId: string
): Promise<Prescription[]> {
  // Verificar que el paciente existe
  const patient = await patientRepository.findById(patientId);

  if (!patient) {
    throw createNotFoundError('Paciente no encontrado');
  }

  return await prescriptionRepository.findByPatientId(patientId);
}
