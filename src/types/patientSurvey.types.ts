import type { z } from 'zod';

import type {
  answerSchema,
  assignSurveySchema,
  getPatientSurveysQuerySchema
} from '@/schemas/patientSurvey.schema';

export interface Answer {
  id: string;
  patientSurveyId: string;
  questionId: string;
  answer: boolean;
  comment?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  question: {
    id: string;
    text: string;
    order: string;
    requireComment: boolean;
  };
}

export interface PatientSurvey {
  id: string;
  patientId: string;
  surveyId: string;
  completedBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientSurveyWithDetails extends PatientSurvey {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    medicalRecordNumber: string;
  };
  survey: {
    id: string;
    name: string;
    description?: string;
  };
  completedByUser: {
    id: string;
    fullName: string;
  };
  answers: Answer[];
}

export interface PaginatedPatientSurveys {
  data: PatientSurveyWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type AnswerDTO = z.infer<typeof answerSchema>;

export type AssignSurveyDTO = z.infer<typeof assignSurveySchema>;

export type GetPatientSurveysQueryDTO = z.infer<
  typeof getPatientSurveysQuerySchema
>;
