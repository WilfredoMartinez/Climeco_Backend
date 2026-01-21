import { z } from 'zod';

import { toothSchema } from '@/schemas/odontogram.schema';

export const createDentalHistorySchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  appointmentId: z.string().uuid('ID de cita inválido'),
  chiefComplaint: z
    .string()
    .max(500, 'La queja principal no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable(),
  diagnosis: z
    .string()
    .max(500, 'El diagnóstico no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable(),
  oralHygieneLevel: z
    .enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR'])
    .default('FAIR'),
  gumCondition: z
    .enum([
      'HEALTHY',
      'GINGIVITIS',
      'PERIODONTITIS',
      'BLEEDING',
      'INFLAMMATION'
    ])
    .default('HEALTHY'),
  hasCalculus: z.boolean().default(false),
  hasPlaque: z.boolean().default(false),
  hasHalitosis: z.boolean().default(false),
  treatmentPlan: z
    .string()
    .max(1000, 'El plan de tratamiento no puede exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable(),
  nextVisitDate: z.coerce.date().optional().nullable(),
  recommendations: z
    .string()
    .max(1000, 'Las recomendaciones no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable(),
  // Odontograma (opcional) - datos de las piezas dentales
  teeth: z
    .array(toothSchema)
    .min(1, 'Debe incluir al menos un diente')
    .max(32, 'Máximo 32 dientes permitidos')
    .optional()
});

export const updateDentalHistorySchema = z.object({
  chiefComplaint: z
    .string()
    .max(500, 'La queja principal no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable(),
  diagnosis: z
    .string()
    .max(500, 'El diagnóstico no puede exceder 500 caracteres')
    .trim()
    .optional()
    .nullable(),
  oralHygieneLevel: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']).optional(),
  gumCondition: z
    .enum([
      'HEALTHY',
      'GINGIVITIS',
      'PERIODONTITIS',
      'BLEEDING',
      'INFLAMMATION'
    ])
    .optional(),
  hasCalculus: z.boolean().optional(),
  hasPlaque: z.boolean().optional(),
  hasHalitosis: z.boolean().optional(),
  treatmentPlan: z
    .string()
    .max(1000, 'El plan de tratamiento no puede exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable(),
  nextVisitDate: z.coerce.date().optional().nullable(),
  recommendations: z
    .string()
    .max(1000, 'Las recomendaciones no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const getDentalHistoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional()
});

export const dentalHistoryIdSchema = z.object({
  id: z.string().uuid('ID de historial dental inválido')
});
