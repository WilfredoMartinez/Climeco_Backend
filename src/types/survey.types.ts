import type { z } from 'zod';

import type {
  createQuestionSchema,
  createSurveySchema,
  getSurveysQuerySchema,
  reorderQuestionsSchema,
  updateQuestionSchema,
  updateSurveySchema
} from '@/schemas/survey.schema';

export type CreateSurveyDTO = z.infer<typeof createSurveySchema>;
export type UpdateSurveyDTO = z.infer<typeof updateSurveySchema>;
export type GetSurveysQueryDTO = z.infer<typeof getSurveysQuerySchema>;

export type CreateQuestionDTO = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionDTO = z.infer<typeof updateQuestionSchema>;
export type ReorderQuestionsDTO = z.infer<typeof reorderQuestionsSchema>;

export type Survey = {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SurveyWithQuestions = Survey & {
  questions: Question[];
};

export type Question = {
  id: string;
  surveyId: string;
  order: string;
  text: string;
  requireComment: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedSurveys = {
  data: SurveyWithQuestions[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
