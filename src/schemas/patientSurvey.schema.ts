import { z } from 'zod';

export const answerSchema = z.object({
  questionId: z.string().uuid('ID de pregunta inválido'),
  answer: z.boolean({
    message: 'La respuesta debe ser verdadero o falso'
  }),
  comment: z
    .string()
    .max(1000, 'El comentario no puede exceder 1000 caracteres')
    .optional()
});

export const assignSurveySchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  surveyId: z.string().uuid('ID de cuestionario inválido'),
  answers: z
    .array(answerSchema)
    .min(1, 'Debe proporcionar al menos una respuesta')
    .max(100, 'Máximo 100 respuestas por cuestionario')
});

export const patientSurveyIdSchema = z.object({
  id: z.string().uuid('ID inválido')
});

export const getPatientSurveysQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  patientId: z.string().uuid('ID de paciente inválido').optional(),
  surveyId: z.string().uuid('ID de cuestionario inválido').optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;

      return val === 'true';
    })
});
