import { z } from 'zod';

export const createAllergySchema = z.object({
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
    .nullable()
});

export const updateAllergySchema = createAllergySchema.partial();

export const getAllergiesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  term: z.string().trim().optional()
});

export const allergyIdSchema = z.object({
  id: z.uuid('ID de alergia inválido')
});
