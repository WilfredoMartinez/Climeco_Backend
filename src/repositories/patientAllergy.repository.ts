import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type {
  PatientAllergies,
  PatientAllergy,
  PatientAllergyRelation
} from '@/types/patientAllergy.types';

export const findPatientAllergyRelation = async (
  patientId: string,
  allergyId: string,
  tx?: Prisma.TransactionClient
): Promise<PatientAllergyRelation | null> => {
  const client = tx ?? prisma;

  return await client.patientAllergy.findFirst({
    where: {
      patientId,
      allergyTypeId: allergyId
    },
    select: {
      id: true,
      patientId: true,
      allergyTypeId: true,
      isActive: true,
      deletedAt: true
    }
  });
};

export const createPatientAllergy = async (
  patientId: string,
  allergyId: string,
  tx?: Prisma.TransactionClient
): Promise<PatientAllergy> => {
  const client = tx ?? prisma;

  return await client.patientAllergy.create({
    data: {
      patientId,
      allergyTypeId: allergyId
    },
    select: {
      id: true,
      patientId: true,
      allergyTypeId: true,
      createdAt: true
    }
  });
};

export const reactivatePatientAllergy = async (
  relationId: string,
  tx?: Prisma.TransactionClient
): Promise<PatientAllergy> => {
  const client = tx ?? prisma;

  return await client.patientAllergy.update({
    where: {
      id: relationId
    },
    data: {
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      patientId: true,
      allergyTypeId: true,
      createdAt: true
    }
  });
};

export const removePatientAllergyById = async (
  relationId: string,
  tx?: Prisma.TransactionClient
): Promise<void> => {
  const client = tx ?? prisma;

  await client.patientAllergy.update({
    where: {
      id: relationId
    },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
};

export const getPatientAllergies = async (
  patientId: string,
  tx?: Prisma.TransactionClient
): Promise<PatientAllergies[]> => {
  const client = tx ?? prisma;

  const allergies = await client.patientAllergy.findMany({
    where: {
      patientId,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      allergy: {
        select: {
          name: true,
          description: true
        }
      },
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return allergies.map((item) => ({
    id: item.id,
    allergyName: item.allergy.name,
    allergyDescription: item.allergy.description,
    createdAt: item.createdAt
  }));
};

/**
 * Buscar relación paciente-alergia activa por ID de relación
 */
export const findActivePatientAllergyById = async (
  relationId: string,
  patientId: string,
  tx?: Prisma.TransactionClient
): Promise<PatientAllergyRelation | null> => {
  const client = tx ?? prisma;

  return await client.patientAllergy.findFirst({
    where: {
      id: relationId,
      patientId,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      patientId: true,
      allergyTypeId: true,
      isActive: true,
      deletedAt: true
    }
  });
};

/**
 * Verificar si un paciente existe
 */
export const patientExists = async (
  patientId: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const client = tx ?? prisma;

  const count = await client.patient.count({
    where: {
      id: patientId,
      isActive: true,
      deletedAt: null
    }
  });

  return count > 0;
};

/**
 * Verificar si una alergia existe
 */
export const allergyExists = async (
  allergyId: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const client = tx ?? prisma;

  const count = await client.allergy.count({
    where: {
      id: allergyId,
      isActive: true,
      deletedAt: null
    }
  });

  return count > 0;
};
