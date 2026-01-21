import { z } from 'zod';

export const createExamCategorySchema = z.object({
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

export const updateExamCategorySchema = createExamCategorySchema.partial();

export const getExamCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  term: z.string().trim().optional()
});

export const examCategoryIdSchema = z.object({
  id: z.uuid('ID de categoría de examen inválido')
});
