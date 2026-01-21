import { z } from 'zod';

export const createPrescriptionItemSchema = z.object({
  medicationId: z.string().uuid('ID de medicamento inválido'),
  quantity: z
    .number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0'),
  dosage: z
    .string()
    .min(1, 'La dosis es requerida')
    .max(100, 'La dosis no puede exceder 100 caracteres')
    .trim(),
  frequency: z
    .string()
    .min(1, 'La frecuencia es requerida')
    .max(100, 'La frecuencia no puede exceder 100 caracteres')
    .trim(),
  duration: z
    .string()
    .min(1, 'La duración es requerida')
    .max(100, 'La duración no puede exceder 100 caracteres')
    .trim(),
  administration: z
    .string()
    .min(1, 'La vía de administración es requerida')
    .max(100, 'La vía de administración no puede exceder 100 caracteres')
    .trim(),
  instructions: z
    .string()
    .max(500, 'Las instrucciones no pueden exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const createPrescriptionSchema = z.object({
  medicalHistoryId: z
    .string()
    .uuid('ID de historial médico inválido')
    .optional()
    .nullable(),
  appointmentId: z.string().uuid('ID de cita inválido').optional().nullable(),
  patientId: z.string().uuid('ID de paciente inválido'),
  generalInstructions: z
    .string()
    .max(1000, 'Las instrucciones generales no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable(),
  dietRecommendations: z
    .string()
    .max(
      1000,
      'Las recomendaciones dietéticas no pueden exceder 1000 caracteres'
    )
    .trim()
    .optional()
    .nullable(),
  restrictions: z
    .string()
    .max(1000, 'Las restricciones no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable(),
  validUntil: z.coerce.date().optional().nullable(),
  items: z
    .array(createPrescriptionItemSchema)
    .min(1, 'La receta debe tener al menos un medicamento')
    .max(20, 'La receta no puede tener más de 20 medicamentos')
});

export const prescriptionIdSchema = z.object({
  id: z.string().uuid('ID de receta inválido')
});
