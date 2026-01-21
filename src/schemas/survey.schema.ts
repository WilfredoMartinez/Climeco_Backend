import { z } from 'zod';

export const questionSchema = z.object({
  text: z.string().min(1, 'El texto de la pregunta es requerido').max(500),
  requireComment: z.boolean().default(false)
});

export const createSurveySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().max(255).optional(),
  questions: z
    .array(questionSchema)
    .max(100, 'Máximo 100 preguntas por cuestionario')
    .optional()
});

export const updateSurveySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(255).optional()
});

export const surveyIdSchema = z.object({
  id: z.uuid('ID inválido')
});

export const getSurveysQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional()
});

export const createQuestionSchema = z.object({
  text: z.string().min(1, 'El texto de la pregunta es requerido').max(500),
  requireComment: z.boolean().default(false),
  order: z.string().optional()
});

export const updateQuestionSchema = z.object({
  text: z.string().min(1).max(500).optional(),
  requireComment: z.boolean().optional(),
  order: z.string().optional()
});

export const questionIdSchema = z.object({
  questionId: z.uuid('ID de pregunta inválido')
});

export const reorderQuestionsSchema = z.object({
  questionIds: z.array(z.uuid()).min(1).max(100)
});
