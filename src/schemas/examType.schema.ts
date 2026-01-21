import { z } from 'zod';

export const createExamTypeSchema = z.object({
  examCategoryId: z.string().uuid('ID de categoría de examen inválido'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable(),
  price: z
    .number()
    .nonnegative('El precio no puede ser negativo')
    .finite('El precio debe ser un número válido')
    .default(0.0),
  duration: z
    .number()
    .int('La duración debe ser un número entero')
    .positive('La duración debe ser mayor a 0')
    .default(30),
  durationTimeUnit: z.enum(['MINUTES', 'HOURS', 'DAYS']).default('MINUTES')
});

export const updateExamTypeSchema = z.object({
  examCategoryId: z
    .string()
    .uuid('ID de categoría de examen inválido')
    .optional(),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable(),
  price: z
    .number()
    .nonnegative('El precio no puede ser negativo')
    .finite('El precio debe ser un número válido')
    .optional(),
  duration: z
    .number()
    .int('La duración debe ser un número entero')
    .positive('La duración debe ser mayor a 0')
    .optional(),
  durationTimeUnit: z.enum(['MINUTES', 'HOURS', 'DAYS']).optional()
});

export const getExamTypesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  examCategoryId: z.string().uuid().optional(),
  term: z.string().trim().optional()
});

export const examTypeIdSchema = z.object({
  id: z.uuid('ID de tipo de examen inválido')
});
