import type { VitalSigns } from '@prisma/client';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';

export interface CreateVitalSignsData {
  appointmentId: string;
  patientId: string;
  recordedById: string;
  weight?: number | null;
  height?: number | null;
  temperature?: number | null;
  systolicPressure?: number | null;
  diastolicPressure?: number | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  notes?: string | null;
}

export async function create(
  data: CreateVitalSignsData,
  tx?: PrismaTransactionClient
): Promise<VitalSigns> {
  const db = tx || prisma;

  return await db.vitalSigns.create({
    data: {
      appointmentId: data.appointmentId,
      patientId: data.patientId,
      recordedById: data.recordedById,
      weight: data.weight,
      height: data.height,
      temperature: data.temperature,
      systolicPressure: data.systolicPressure,
      diastolicPressure: data.diastolicPressure,
      heartRate: data.heartRate,
      respiratoryRate: data.respiratoryRate,
      oxygenSaturation: data.oxygenSaturation,
      notes: data.notes
    }
  });
}

export async function findByAppointmentId(
  appointmentId: string,
  tx?: PrismaTransactionClient
): Promise<VitalSigns | null> {
  const db = tx || prisma;

  return await db.vitalSigns.findUnique({
    where: { appointmentId }
  });
}

export interface UpdateVitalSignsData {
  weight?: number | null;
  height?: number | null;
  temperature?: number | null;
  systolicPressure?: number | null;
  diastolicPressure?: number | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  notes?: string | null;
}

export async function update(
  appointmentId: string,
  data: UpdateVitalSignsData,
  tx?: PrismaTransactionClient
): Promise<VitalSigns> {
  const db = tx || prisma;

  return await db.vitalSigns.update({
    where: { appointmentId },
    data: {
      weight: data.weight,
      height: data.height,
      temperature: data.temperature,
      systolicPressure: data.systolicPressure,
      diastolicPressure: data.diastolicPressure,
      heartRate: data.heartRate,
      respiratoryRate: data.respiratoryRate,
      oxygenSaturation: data.oxygenSaturation,
      notes: data.notes
    }
  });
}
