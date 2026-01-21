import type { ToothCondition as PrismaToothCondition } from '@prisma/client';
import type { z } from 'zod';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type { toothSchema } from '@/schemas/odontogram.schema';
import type {
  CreateOdontogramDTO,
  Odontogram,
  ToothCondition,
  UpdateOdontogramDTO,
  UpdateToothDTO
} from '@/types/odontogram.types';

type ToothInput = z.infer<typeof toothSchema>;

export async function create(
  data: CreateOdontogramDTO,
  tx?: PrismaTransactionClient
): Promise<Odontogram> {
  const client = tx ?? prisma;

  const odontogram = await client.odontogram.create({
    data: {
      dentalHistoryId: data.dentalHistoryId,
      teeth: {
        create: data.teeth.map((tooth: ToothInput) => ({
          toothNumber: tooth.toothNumber,
          position: tooth.position,
          quadrant: tooth.quadrant ?? null,
          affectedSurfaces: tooth.affectedSurfaces ?? null,
          condition: tooth.condition as PrismaToothCondition,
          notes: tooth.notes ?? null
        }))
      }
    },
    include: {
      teeth: {
        orderBy: {
          toothNumber: 'asc'
        }
      }
    }
  });

  return {
    id: odontogram.id,
    dentalHistoryId: odontogram.dentalHistoryId,
    teeth: odontogram.teeth.map((tooth) => ({
      id: tooth.id,
      toothNumber: tooth.toothNumber,
      position: tooth.position,
      quadrant: tooth.quadrant,
      affectedSurfaces: tooth.affectedSurfaces,
      condition: tooth.condition as ToothCondition,
      notes: tooth.notes
    })),
    createdAt: odontogram.createdAt,
    updatedAt: odontogram.updatedAt
  };
}

export async function findByDentalHistoryId(
  dentalHistoryId: string,
  tx?: PrismaTransactionClient
): Promise<Odontogram | null> {
  const client = tx ?? prisma;

  const odontogram = await client.odontogram.findUnique({
    where: {
      dentalHistoryId
    },
    include: {
      teeth: {
        orderBy: {
          toothNumber: 'asc'
        }
      }
    }
  });

  if (!odontogram) return null;

  return {
    id: odontogram.id,
    dentalHistoryId: odontogram.dentalHistoryId,
    teeth: odontogram.teeth.map((tooth) => ({
      id: tooth.id,
      toothNumber: tooth.toothNumber,
      position: tooth.position,
      quadrant: tooth.quadrant,
      affectedSurfaces: tooth.affectedSurfaces,
      condition: tooth.condition as ToothCondition,
      notes: tooth.notes
    })),
    createdAt: odontogram.createdAt,
    updatedAt: odontogram.updatedAt
  };
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<Odontogram | null> {
  const client = tx ?? prisma;

  const odontogram = await client.odontogram.findUnique({
    where: { id },
    include: {
      teeth: {
        orderBy: {
          toothNumber: 'asc'
        }
      }
    }
  });

  if (!odontogram) return null;

  return {
    id: odontogram.id,
    dentalHistoryId: odontogram.dentalHistoryId,
    teeth: odontogram.teeth.map((tooth) => ({
      id: tooth.id,
      toothNumber: tooth.toothNumber,
      position: tooth.position,
      quadrant: tooth.quadrant,
      affectedSurfaces: tooth.affectedSurfaces,
      condition: tooth.condition as ToothCondition,
      notes: tooth.notes
    })),
    createdAt: odontogram.createdAt,
    updatedAt: odontogram.updatedAt
  };
}

export async function update(
  id: string,
  data: UpdateOdontogramDTO,
  tx?: PrismaTransactionClient
): Promise<Odontogram> {
  const client = tx ?? prisma;

  // Eliminar dientes existentes y crear nuevos
  await client.tooth.deleteMany({
    where: { odontogramId: id }
  });

  const odontogram = await client.odontogram.update({
    where: { id },
    data: {
      teeth: {
        create: data.teeth.map((tooth: ToothInput) => ({
          toothNumber: tooth.toothNumber,
          position: tooth.position,
          quadrant: tooth.quadrant ?? null,
          affectedSurfaces: tooth.affectedSurfaces ?? null,
          condition: tooth.condition as PrismaToothCondition,
          notes: tooth.notes ?? null
        }))
      },
      updatedAt: new Date()
    },
    include: {
      teeth: {
        orderBy: {
          toothNumber: 'asc'
        }
      }
    }
  });

  return {
    id: odontogram.id,
    dentalHistoryId: odontogram.dentalHistoryId,
    teeth: odontogram.teeth.map((tooth) => ({
      id: tooth.id,
      toothNumber: tooth.toothNumber,
      position: tooth.position,
      quadrant: tooth.quadrant,
      affectedSurfaces: tooth.affectedSurfaces,
      condition: tooth.condition as ToothCondition,
      notes: tooth.notes
    })),
    createdAt: odontogram.createdAt,
    updatedAt: odontogram.updatedAt
  };
}

export async function updateTooth(
  odontogramId: string,
  toothId: string,
  data: UpdateToothDTO,
  tx?: PrismaTransactionClient
): Promise<Odontogram> {
  const client = tx ?? prisma;

  await client.tooth.update({
    where: {
      id: toothId,
      odontogramId
    },
    data: {
      affectedSurfaces: data.affectedSurfaces,
      condition: data.condition,
      notes: data.notes,
      updatedAt: new Date()
    }
  });

  // Devolver el odontograma completo actualizado
  const odontogram = await findById(odontogramId, client);

  if (!odontogram) {
    throw new Error('Odontograma no encontrado');
  }

  return odontogram;
}

export async function remove(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.odontogram.delete({
    where: { id }
  });
}
