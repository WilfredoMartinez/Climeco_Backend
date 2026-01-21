import { z } from 'zod';

export const createExamSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  examTypeId: z.string().uuid('ID de tipo de examen inválido'),
  scheduledAt: z.coerce.date(),
  status: z
    .enum(['PENDING', 'COMPLETED', 'DELIVERED', 'CANCELLED'])
    .default('PENDING'),
  notes: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const updateExamSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido').optional(),
  examTypeId: z.string().uuid('ID de tipo de examen inválido').optional(),
  scheduledAt: z.coerce.date().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'DELIVERED', 'CANCELLED']).optional(),
  notes: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const getExamsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  patientId: z.string().uuid().optional(),
  examTypeId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'DELIVERED', 'CANCELLED']).optional(),
  term: z.string().trim().optional()
});

export const examIdSchema = z.object({
  id: z.string().uuid('ID de examen inválido')
});
