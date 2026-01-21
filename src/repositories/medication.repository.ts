import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import type {
  Medication,
  CreateMedicationDTO,
  UpdateMedicationDTO,
  GetMedicationsQueryDTO
} from '@/types/medication.types';

/**
 * Crear un nuevo medicamento
 */
export const createMedication = async (
  data: CreateMedicationDTO,
  tx?: Prisma.TransactionClient
): Promise<Medication> => {
  const client = tx ?? prisma;

  return await client.medication.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      code: data.code,
      stock: data.stock,
      minStock: data.minStock,
      price: data.price,
      costPrice: data.costPrice,
      measureUnit: data.measureUnit,
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : null
    },
    select: {
      id: true,
      categoryId: true,
      name: true,
      description: true,
      code: true,
      stock: true,
      minStock: true,
      price: true,
      costPrice: true,
      measureUnit: true,
      expirationDate: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

/**
 * Obtener medicamentos con filtros y paginación
 */
export const getMedications = async (
  query: GetMedicationsQueryDTO,
  tx?: Prisma.TransactionClient
): Promise<{ data: Medication[]; total: number }> => {
  const client = tx ?? prisma;
  const { page, limit, term, categoryId } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.MedicationWhereInput = {
    isActive: true,
    deletedAt: null,
    ...(categoryId && { categoryId }),
    ...(term && {
      OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { code: { contains: term, mode: 'insensitive' } }
      ]
    })
  };

  const [data, total] = await Promise.all([
    client.medication.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        categoryId: true,
        name: true,
        description: true,
        code: true,
        stock: true,
        minStock: true,
        price: true,
        costPrice: true,
        measureUnit: true,
        expirationDate: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    }),
    client.medication.count({ where })
  ]);

  return { data, total };
};

/**
 * Obtener un medicamento por ID
 */
export const getMedicationById = async (
  id: string,
  tx?: Prisma.TransactionClient
): Promise<Medication | null> => {
  const client = tx ?? prisma;

  return await client.medication.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      categoryId: true,
      name: true,
      description: true,
      code: true,
      stock: true,
      minStock: true,
      price: true,
      costPrice: true,
      measureUnit: true,
      expirationDate: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

/**
 * Actualizar un medicamento
 */
export const updateMedication = async (
  id: string,
  data: UpdateMedicationDTO,
  tx?: Prisma.TransactionClient
): Promise<Medication> => {
  const client = tx ?? prisma;

  return await client.medication.update({
    where: { id },
    data: {
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.code !== undefined && { code: data.code }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.minStock !== undefined && { minStock: data.minStock }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.costPrice !== undefined && { costPrice: data.costPrice }),
      ...(data.measureUnit !== undefined && { measureUnit: data.measureUnit }),
      ...(data.expirationDate !== undefined && {
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : null
      })
    },
    select: {
      id: true,
      categoryId: true,
      name: true,
      description: true,
      code: true,
      stock: true,
      minStock: true,
      price: true,
      costPrice: true,
      measureUnit: true,
      expirationDate: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

/**
 * Eliminar un medicamento (soft delete)
 */
export const deleteMedication = async (
  id: string,
  tx?: Prisma.TransactionClient
): Promise<void> => {
  const client = tx ?? prisma;

  await client.medication.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
};

/**
 * Verificar si un medicamento existe por nombre
 */
export const medicationExistsByName = async (
  name: string,
  excludeId?: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const client = tx ?? prisma;

  const count = await client.medication.count({
    where: {
      name,
      isActive: true,
      deletedAt: null,
      ...(excludeId && { id: { not: excludeId } })
    }
  });

  return count > 0;
};

/**
 * Verificar si un medicamento existe por código
 */
export const medicationExistsByCode = async (
  code: string,
  excludeId?: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const client = tx ?? prisma;

  const count = await client.medication.count({
    where: {
      code,
      isActive: true,
      deletedAt: null,
      ...(excludeId && { id: { not: excludeId } })
    }
  });

  return count > 0;
};

/**
 * Verificar si una categoría existe
 */
export const categoryExists = async (
  categoryId: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const client = tx ?? prisma;

  const count = await client.medicationCategory.count({
    where: {
      id: categoryId,
      isActive: true,
      deletedAt: null
    }
  });

  return count > 0;
};
