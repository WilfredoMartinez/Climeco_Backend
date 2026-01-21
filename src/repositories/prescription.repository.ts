import type { PrismaTransactionClient } from '@/lib/prisma';
import { prisma } from '@/lib/prisma';
import type {
  CreatePrescriptionDTO,
  Prescription,
  PrescriptionItem
} from '@/types/prescription.types';

export async function create(
  data: CreatePrescriptionDTO,
  doctorId: string,
  tx?: PrismaTransactionClient
): Promise<Prescription> {
  const client = tx ?? prisma;

  // Generar número de receta
  const year = new Date().getFullYear();
  const lastPrescription = await client.prescription.findFirst({
    where: {
      prescriptionNumber: {
        startsWith: `RX-${year}-`
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      prescriptionNumber: true
    }
  });

  let prescriptionNumber: string;

  if (lastPrescription) {
    const lastNumber = parseInt(
      lastPrescription.prescriptionNumber.split('-')[2]
    );

    prescriptionNumber = `RX-${year}-${String(lastNumber + 1).padStart(4, '0')}`;
  } else {
    prescriptionNumber = `RX-${year}-0001`;
  }

  // Crear la receta
  const prescription = await client.prescription.create({
    data: {
      medicalHistoryId: data.medicalHistoryId ?? undefined,
      appointmentId: data.appointmentId ?? undefined,
      patientId: data.patientId,
      doctorId,
      prescriptionNumber,
      generalInstructions: data.generalInstructions ?? null,
      dietRecommendations: data.dietRecommendations ?? null,
      restrictions: data.restrictions ?? null,
      validUntil: data.validUntil ?? null,
      prescriptionItems: {
        create: data.items.map(
          (item: {
            medicationId: string;
            quantity: number;
            dosage: string;
            frequency: string;
            duration: string;
            administration: string;
            instructions?: string | null;
          }) => ({
            medicationId: item.medicationId,
            quantity: item.quantity,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            administration: item.administration,
            instructions: item.instructions ?? null
          })
        )
      }
    },
    include: {
      prescriptionItems: {
        include: {
          medication: {
            select: {
              name: true,
              measureUnit: true
            }
          }
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          medicalRecordNumber: true
        }
      },
      doctor: {
        select: {
          fullName: true
        }
      }
    }
  });

  return {
    id: prescription.id,
    medicalHistoryId: prescription.medicalHistoryId ?? undefined,
    appointmentId: prescription.appointmentId ?? undefined,
    patientId: prescription.patientId,
    doctorId: prescription.doctorId,
    prescriptionNumber: prescription.prescriptionNumber,
    generalInstructions: prescription.generalInstructions ?? undefined,
    dietRecommendations: prescription.dietRecommendations ?? undefined,
    restrictions: prescription.restrictions ?? undefined,
    validUntil: prescription.validUntil ?? undefined,
    isActive: prescription.isActive,
    createdAt: prescription.createdAt,
    updatedAt: prescription.updatedAt,
    prescriptionItems: prescription.prescriptionItems.map((item) => ({
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
    })),
    patient: {
      firstName: prescription.patient.firstName,
      lastName: prescription.patient.lastName,
      medicalRecordNumber: prescription.patient.medicalRecordNumber
    },
    doctor: {
      fullName: prescription.doctor.fullName
    }
  };
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<Prescription | null> {
  const client = tx ?? prisma;

  const prescription = await client.prescription.findFirst({
    where: {
      id,
      isActive: true
    },
    include: {
      prescriptionItems: {
        include: {
          medication: {
            select: {
              name: true,
              measureUnit: true
            }
          }
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          medicalRecordNumber: true
        }
      },
      doctor: {
        select: {
          fullName: true
        }
      }
    }
  });

  if (!prescription) {
    return null;
  }

  return {
    id: prescription.id,
    medicalHistoryId: prescription.medicalHistoryId ?? undefined,
    appointmentId: prescription.appointmentId ?? undefined,
    patientId: prescription.patientId,
    doctorId: prescription.doctorId,
    prescriptionNumber: prescription.prescriptionNumber,
    generalInstructions: prescription.generalInstructions ?? undefined,
    dietRecommendations: prescription.dietRecommendations ?? undefined,
    restrictions: prescription.restrictions ?? undefined,
    validUntil: prescription.validUntil ?? undefined,
    isActive: prescription.isActive,
    createdAt: prescription.createdAt,
    updatedAt: prescription.updatedAt,
    prescriptionItems: prescription.prescriptionItems.map((item) => ({
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
    })),
    patient: {
      firstName: prescription.patient.firstName,
      lastName: prescription.patient.lastName,
      medicalRecordNumber: prescription.patient.medicalRecordNumber
    },
    doctor: {
      fullName: prescription.doctor.fullName
    }
  };
}

export async function findByPatientId(
  patientId: string,
  tx?: PrismaTransactionClient
): Promise<Prescription[]> {
  const client = tx ?? prisma;

  const prescriptions = await client.prescription.findMany({
    where: {
      patientId,
      isActive: true
    },
    include: {
      prescriptionItems: {
        include: {
          medication: {
            select: {
              name: true,
              measureUnit: true
            }
          }
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          medicalRecordNumber: true
        }
      },
      doctor: {
        select: {
          fullName: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return prescriptions.map((prescription) => ({
    id: prescription.id,
    medicalHistoryId: prescription.medicalHistoryId ?? undefined,
    patientId: prescription.patientId,
    doctorId: prescription.doctorId,
    prescriptionNumber: prescription.prescriptionNumber,
    generalInstructions: prescription.generalInstructions ?? undefined,
    dietRecommendations: prescription.dietRecommendations ?? undefined,
    restrictions: prescription.restrictions ?? undefined,
    validUntil: prescription.validUntil ?? undefined,
    isActive: prescription.isActive,
    createdAt: prescription.createdAt,
    updatedAt: prescription.updatedAt,
    prescriptionItems: prescription.prescriptionItems.map((item) => ({
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
    })),
    patient: {
      firstName: prescription.patient.firstName,
      lastName: prescription.patient.lastName,
      medicalRecordNumber: prescription.patient.medicalRecordNumber
    },
    doctor: {
      fullName: prescription.doctor.fullName
    }
  }));
}

export async function dischargeMedications(
  prescriptionItems: PrescriptionItem[],
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  for (const item of prescriptionItems) {
    await client.medication.update({
      where: {
        id: item.medicationId
      },
      data: {
        stock: {
          decrement: item.quantity
        }
      }
    });
  }
}
