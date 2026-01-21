import { z } from 'zod';

export const createSpecialtySchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  description: z
    .string()
    .max(255, 'La descripción no puede exceder 255 caracteres')
    .trim()
    .optional()
    .nullable(),
  area: z
    .enum(
      ['MEDICINA_GENERAL', 'ODONTOLOGIA', 'ADMINISTRATIVO'],
      'Área inválida'
    )
    .default('MEDICINA_GENERAL')
});

export const updateSpecialtySchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim()
    .optional(),
  description: z
    .string()
    .max(255, 'La descripción no puede exceder 255 caracteres')
    .trim()
    .optional()
    .nullable(),
  area: z
    .enum(
      ['MEDICINA_GENERAL', 'ODONTOLOGIA', 'ADMINISTRATIVO'],
      'Área inválida'
    )
    .optional()
});

export const getSpecialtiesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  term: z.string().trim().optional(),
  area: z.enum(['MEDICINA_GENERAL', 'ODONTOLOGIA', 'ADMINISTRATIVO']).optional()
});

export const specialtyIdSchema = z.object({
  id: z.uuid('ID de especialidad inválido')
});
