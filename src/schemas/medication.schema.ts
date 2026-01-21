import { z } from 'zod';

// Enum de MeasureUnit
export const measureUnitEnum = z.enum([
  'TABLET',
  'CAPSULE',
  'ML',
  'MG',
  'G',
  'LITER'
]);

// Schema para crear medicamento
export const createMedicationSchema = z.object({
  categoryId: z.string().uuid('ID de categoría inválido'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .trim(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable(),
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(100, 'El código no puede exceder 100 caracteres')
    .trim(),
  stock: z
    .number()
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .default(0),
  minStock: z
    .number()
    .int('El stock mínimo debe ser un número entero')
    .min(0, 'El stock mínimo no puede ser negativo')
    .default(0),
  price: z.number().min(0, 'El precio no puede ser negativo').default(0.0),
  costPrice: z
    .number()
    .min(0, 'El precio de costo no puede ser negativo')
    .default(0.0),
  measureUnit: measureUnitEnum.default('MG'),
  expirationDate: z
    .string()
    .datetime('Fecha de expiración inválida')
    .optional()
    .nullable()
});

// Schema para actualizar medicamento
export const updateMedicationSchema = createMedicationSchema.partial();

// Schema para query de listado
export const getMedicationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  term: z.string().trim().optional(),
  categoryId: z.string().uuid('ID de categoría inválido').optional()
});

// Schema para ID de medicamento
export const medicationIdSchema = z.object({
  id: z.string().uuid('ID de medicamento inválido')
});
