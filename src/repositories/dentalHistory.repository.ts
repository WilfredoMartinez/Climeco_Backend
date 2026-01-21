import type { Prisma } from '@prisma/client';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  CreateDentalHistoryDTO,
  DentalHistory,
  UpdateDentalHistoryDTO,
  OralHygieneLevel,
  GumCondition
} from '@/types/dentalHistory.types';

export async function create(
  data: CreateDentalHistoryDTO,
  doctorId: string,
  tx?: PrismaTransactionClient
): Promise<DentalHistory> {
  const client = tx ?? prisma;

  const dentalHistory = await client.dentalHistory.create({
    data: {
      patientId: data.patientId,
      doctorId,
      appointmentId: data.appointmentId,
      chiefComplaint: data.chiefComplaint ?? null,
      diagnosis: data.diagnosis ?? null,
      oralHygieneLevel: data.oralHygieneLevel ?? 'FAIR',
      gumCondition: data.gumCondition ?? 'HEALTHY',
      hasCalculus: data.hasCalculus ?? false,
      hasPlaque: data.hasPlaque ?? false,
      hasHalitosis: data.hasHalitosis ?? false,
      treatmentPlan: data.treatmentPlan ?? null,
      nextVisitDate: data.nextVisitDate ?? null,
      recommendations: data.recommendations ?? null
    },
    select: {
      id: true,
      patientId: true,
      doctorId: true,
      appointmentId: true,
      chiefComplaint: true,
      diagnosis: true,
      oralHygieneLevel: true,
      gumCondition: true,
      hasCalculus: true,
      hasPlaque: true,
      hasHalitosis: true,
      treatmentPlan: true,
      nextVisitDate: true,
      recommendations: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return {
    id: dentalHistory.id,
    patientId: dentalHistory.patientId,
    doctorId: dentalHistory.doctorId,
    appointmentId: dentalHistory.appointmentId,
    chiefComplaint: dentalHistory.chiefComplaint ?? undefined,
    diagnosis: dentalHistory.diagnosis ?? undefined,
    oralHygieneLevel: dentalHistory.oralHygieneLevel as OralHygieneLevel,
    gumCondition: dentalHistory.gumCondition as GumCondition,
    hasCalculus: dentalHistory.hasCalculus,
    hasPlaque: dentalHistory.hasPlaque,
    hasHalitosis: dentalHistory.hasHalitosis,
    treatmentPlan: dentalHistory.treatmentPlan ?? undefined,
    nextVisitDate: dentalHistory.nextVisitDate ?? undefined,
    recommendations: dentalHistory.recommendations ?? undefined,
    createdAt: dentalHistory.createdAt,
    updatedAt: dentalHistory.updatedAt
  };
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<DentalHistory | null> {
  const client = tx ?? prisma;

  const dentalHistory = await client.dentalHistory.findFirst({
    where: {
      id,
      isActive: true
    },
    select: {
      id: true,
      patientId: true,
      doctorId: true,
      appointmentId: true,
      chiefComplaint: true,
      diagnosis: true,
      oralHygieneLevel: true,
      gumCondition: true,
      hasCalculus: true,
      hasPlaque: true,
      hasHalitosis: true,
      treatmentPlan: true,
      nextVisitDate: true,
      recommendations: true,
      createdAt: true,
      updatedAt: true,
      appointment: {
        select: {
          prescriptions: {
            where: {
              isActive: true
            },
            select: {
              id: true,
              prescriptionNumber: true,
              generalInstructions: true,
              dietRecommendations: true,
              restrictions: true,
              validUntil: true,
              createdAt: true,
              updatedAt: true,
              prescriptionItems: {
                select: {
                  id: true,
                  prescriptionId: true,
                  medicationId: true,
                  quantity: true,
                  dosage: true,
                  frequency: true,
                  duration: true,
                  administration: true,
                  instructions: true,
                  createdAt: true,
                  updatedAt: true,
                  medication: {
                    select: {
                      name: true,
                      measureUnit: true
                    }
                  }
                }
              }
            },
            take: 1
          }
        }
      },
      odontogram: {
        select: {
          id: true,
          dentalHistoryId: true,
          createdAt: true,
          updatedAt: true,
          teeth: {
            select: {
              id: true,
              toothNumber: true,
              position: true,
              quadrant: true,
              affectedSurfaces: true,
              condition: true,
              notes: true
            },
            orderBy: {
              toothNumber: 'asc'
            }
          }
        }
      }
    }
  });

  if (!dentalHistory) return null;

  return {
    id: dentalHistory.id,
    patientId: dentalHistory.patientId,
    doctorId: dentalHistory.doctorId,
    appointmentId: dentalHistory.appointmentId,
    chiefComplaint: dentalHistory.chiefComplaint ?? undefined,
    diagnosis: dentalHistory.diagnosis ?? undefined,
    oralHygieneLevel: dentalHistory.oralHygieneLevel as OralHygieneLevel,
    gumCondition: dentalHistory.gumCondition as GumCondition,
    hasCalculus: dentalHistory.hasCalculus,
    hasPlaque: dentalHistory.hasPlaque,
    hasHalitosis: dentalHistory.hasHalitosis,
    treatmentPlan: dentalHistory.treatmentPlan ?? undefined,
    nextVisitDate: dentalHistory.nextVisitDate ?? undefined,
    recommendations: dentalHistory.recommendations ?? undefined,
    odontogram: dentalHistory.odontogram
      ? {
          id: dentalHistory.odontogram.id,
          dentalHistoryId: dentalHistory.odontogram.dentalHistoryId,
          teeth: dentalHistory.odontogram.teeth.map((tooth) => ({
            id: tooth.id,
            toothNumber: tooth.toothNumber,
            position: tooth.position,
            quadrant: tooth.quadrant ?? null,
            affectedSurfaces: tooth.affectedSurfaces ?? null,
            condition:
              tooth.condition as import('@/types/odontogram.types').ToothCondition,
            notes: tooth.notes ?? null
          })),
          createdAt: dentalHistory.odontogram.createdAt,
          updatedAt: dentalHistory.odontogram.updatedAt
        }
      : undefined,
    prescription:
      dentalHistory.appointment.prescriptions.length > 0
        ? {
            id: dentalHistory.appointment.prescriptions[0].id,
            prescriptionNumber:
              dentalHistory.appointment.prescriptions[0].prescriptionNumber,
            generalInstructions:
              dentalHistory.appointment.prescriptions[0].generalInstructions ??
              undefined,
            dietRecommendations:
              dentalHistory.appointment.prescriptions[0].dietRecommendations ??
              undefined,
            restrictions:
              dentalHistory.appointment.prescriptions[0].restrictions ??
              undefined,
            validUntil:
              dentalHistory.appointment.prescriptions[0].validUntil ??
              undefined,
            prescriptionItems:
              dentalHistory.appointment.prescriptions[0].prescriptionItems.map(
                (item) => ({
                  id: item.id,
                  prescriptionId: item.prescriptionId,
                  medicationId: item.medicationId,
                  quantity: item.quantity,
                  dosage: item.dosage,
                  frequency: item.frequency,
                  duration: item.duration,
                  administration: item.administration,
                  instructions: item.instructions ?? undefined,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  medication: {
                    name: item.medication.name,
                    measureUnit: item.medication.measureUnit
                  }
                })
              ),
            isActive: true,
            createdAt: dentalHistory.appointment.prescriptions[0].createdAt,
            updatedAt: dentalHistory.appointment.prescriptions[0].updatedAt,
            patientId: dentalHistory.patientId,
            doctorId: dentalHistory.doctorId
          }
        : undefined,
    createdAt: dentalHistory.createdAt,
    updatedAt: dentalHistory.updatedAt
  };
}

export async function findByAppointmentId(
  appointmentId: string,
  tx?: PrismaTransactionClient
): Promise<DentalHistory | null> {
  const client = tx ?? prisma;

  const dentalHistory = await client.dentalHistory.findFirst({
    where: {
      appointmentId,
      isActive: true
    },
    select: {
      id: true,
      patientId: true,
      doctorId: true,
      appointmentId: true,
      chiefComplaint: true,
      diagnosis: true,
      oralHygieneLevel: true,
      gumCondition: true,
      hasCalculus: true,
      hasPlaque: true,
      hasHalitosis: true,
      treatmentPlan: true,
      nextVisitDate: true,
      recommendations: true,
      createdAt: true,
      updatedAt: true,
      appointment: {
        select: {
          prescriptions: {
            where: {
              isActive: true
            },
            select: {
              id: true,
              prescriptionNumber: true,
              generalInstructions: true,
              dietRecommendations: true,
              restrictions: true,
              validUntil: true,
              createdAt: true,
              updatedAt: true,
              prescriptionItems: {
                select: {
                  id: true,
                  prescriptionId: true,
                  medicationId: true,
                  quantity: true,
                  dosage: true,
                  frequency: true,
                  duration: true,
                  administration: true,
                  instructions: true,
                  createdAt: true,
                  updatedAt: true,
                  medication: {
                    select: {
                      name: true,
                      measureUnit: true
                    }
                  }
                }
              }
            },
            take: 1
          }
        }
      }
    }
  });

  if (!dentalHistory) return null;

  return {
    id: dentalHistory.id,
    patientId: dentalHistory.patientId,
    doctorId: dentalHistory.doctorId,
    appointmentId: dentalHistory.appointmentId,
    chiefComplaint: dentalHistory.chiefComplaint ?? undefined,
    diagnosis: dentalHistory.diagnosis ?? undefined,
    oralHygieneLevel: dentalHistory.oralHygieneLevel as OralHygieneLevel,
    gumCondition: dentalHistory.gumCondition as GumCondition,
    hasCalculus: dentalHistory.hasCalculus,
    hasPlaque: dentalHistory.hasPlaque,
    hasHalitosis: dentalHistory.hasHalitosis,
    treatmentPlan: dentalHistory.treatmentPlan ?? undefined,
    nextVisitDate: dentalHistory.nextVisitDate ?? undefined,
    recommendations: dentalHistory.recommendations ?? undefined,
    prescription:
      dentalHistory.appointment.prescriptions.length > 0
        ? {
            id: dentalHistory.appointment.prescriptions[0].id,
            prescriptionNumber:
              dentalHistory.appointment.prescriptions[0].prescriptionNumber,
            generalInstructions:
              dentalHistory.appointment.prescriptions[0].generalInstructions ??
              undefined,
            dietRecommendations:
              dentalHistory.appointment.prescriptions[0].dietRecommendations ??
              undefined,
            restrictions:
              dentalHistory.appointment.prescriptions[0].restrictions ??
              undefined,
            validUntil:
              dentalHistory.appointment.prescriptions[0].validUntil ??
              undefined,
            prescriptionItems:
              dentalHistory.appointment.prescriptions[0].prescriptionItems.map(
                (item) => ({
                  id: item.id,
                  prescriptionId: item.prescriptionId,
                  medicationId: item.medicationId,
                  quantity: item.quantity,
                  dosage: item.dosage,
                  frequency: item.frequency,
                  duration: item.duration,
                  administration: item.administration,
                  instructions: item.instructions ?? undefined,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  medication: {
                    name: item.medication.name,
                    measureUnit: item.medication.measureUnit
                  }
                })
              ),
            isActive: true,
            createdAt: dentalHistory.appointment.prescriptions[0].createdAt,
            updatedAt: dentalHistory.appointment.prescriptions[0].updatedAt,
            patientId: dentalHistory.patientId,
            doctorId: dentalHistory.doctorId
          }
        : undefined,
    createdAt: dentalHistory.createdAt,
    updatedAt: dentalHistory.updatedAt
  };
}

export async function findAll(
  filters: {
    patientId: string | undefined;
    doctorId: string | undefined;
    appointmentId: string | undefined;
  },
  page: number,
  limit: number,
  tx?: PrismaTransactionClient
): Promise<{ dentalHistories: DentalHistory[]; total: number }> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where: Prisma.DentalHistoryWhereInput = {
    isActive: true
  };

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.doctorId) {
    where.doctorId = filters.doctorId;
  }

  if (filters.appointmentId) {
    where.appointmentId = filters.appointmentId;
  }

  const [data, total] = await Promise.all([
    client.dentalHistory.findMany({
      where,
      select: {
        id: true,
        patientId: true,
        doctorId: true,
        appointmentId: true,
        chiefComplaint: true,
        diagnosis: true,
        oralHygieneLevel: true,
        gumCondition: true,
        hasCalculus: true,
        hasPlaque: true,
        hasHalitosis: true,
        treatmentPlan: true,
        nextVisitDate: true,
        recommendations: true,
        createdAt: true,
        updatedAt: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    client.dentalHistory.count({ where })
  ]);

  const dentalHistories = data.map((dh) => ({
    id: dh.id,
    patientId: dh.patientId,
    doctorId: dh.doctorId,
    appointmentId: dh.appointmentId,
    chiefComplaint: dh.chiefComplaint ?? undefined,
    diagnosis: dh.diagnosis ?? undefined,
    oralHygieneLevel: dh.oralHygieneLevel as OralHygieneLevel,
    gumCondition: dh.gumCondition as GumCondition,
    hasCalculus: dh.hasCalculus,
    hasPlaque: dh.hasPlaque,
    hasHalitosis: dh.hasHalitosis,
    treatmentPlan: dh.treatmentPlan ?? undefined,
    nextVisitDate: dh.nextVisitDate ?? undefined,
    recommendations: dh.recommendations ?? undefined,
    createdAt: dh.createdAt,
    updatedAt: dh.updatedAt
  }));

  return { dentalHistories, total };
}

export async function update(
  id: string,
  data: UpdateDentalHistoryDTO,
  tx?: PrismaTransactionClient
): Promise<DentalHistory> {
  const client = tx ?? prisma;

  const updateData: Prisma.DentalHistoryUpdateInput = {};

  if (data.chiefComplaint !== undefined) {
    updateData.chiefComplaint = data.chiefComplaint;
  }

  if (data.diagnosis !== undefined) {
    updateData.diagnosis = data.diagnosis;
  }

  if (data.oralHygieneLevel !== undefined) {
    updateData.oralHygieneLevel = data.oralHygieneLevel;
  }

  if (data.gumCondition !== undefined) {
    updateData.gumCondition = data.gumCondition;
  }

  if (data.hasCalculus !== undefined) {
    updateData.hasCalculus = data.hasCalculus;
  }

  if (data.hasPlaque !== undefined) {
    updateData.hasPlaque = data.hasPlaque;
  }

  if (data.hasHalitosis !== undefined) {
    updateData.hasHalitosis = data.hasHalitosis;
  }

  if (data.treatmentPlan !== undefined) {
    updateData.treatmentPlan = data.treatmentPlan;
  }

  if (data.nextVisitDate !== undefined) {
    updateData.nextVisitDate = data.nextVisitDate;
  }

  if (data.recommendations !== undefined) {
    updateData.recommendations = data.recommendations;
  }

  const dentalHistory = await client.dentalHistory.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      patientId: true,
      doctorId: true,
      appointmentId: true,
      chiefComplaint: true,
      diagnosis: true,
      oralHygieneLevel: true,
      gumCondition: true,
      hasCalculus: true,
      hasPlaque: true,
      hasHalitosis: true,
      treatmentPlan: true,
      nextVisitDate: true,
      recommendations: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return {
    id: dentalHistory.id,
    patientId: dentalHistory.patientId,
    doctorId: dentalHistory.doctorId,
    appointmentId: dentalHistory.appointmentId,
    chiefComplaint: dentalHistory.chiefComplaint ?? undefined,
    diagnosis: dentalHistory.diagnosis ?? undefined,
    oralHygieneLevel: dentalHistory.oralHygieneLevel as OralHygieneLevel,
    gumCondition: dentalHistory.gumCondition as GumCondition,
    hasCalculus: dentalHistory.hasCalculus,
    hasPlaque: dentalHistory.hasPlaque,
    hasHalitosis: dentalHistory.hasHalitosis,
    treatmentPlan: dentalHistory.treatmentPlan ?? undefined,
    nextVisitDate: dentalHistory.nextVisitDate ?? undefined,
    recommendations: dentalHistory.recommendations ?? undefined,
    createdAt: dentalHistory.createdAt,
    updatedAt: dentalHistory.updatedAt
  };
}

export async function remove(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.dentalHistory.update({
    where: { id },
    data: {
      isActive: false
    }
  });
}
