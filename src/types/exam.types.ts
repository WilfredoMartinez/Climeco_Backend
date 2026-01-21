import type { z } from 'zod';

import type {
  createExamSchema,
  updateExamSchema,
  getExamsQuerySchema
} from '@/schemas/exam.schema';

export type ExamStatus = 'PENDING' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED';

export interface Exam {
  id: string;
  userId: string;
  patientId: string;
  examTypeId: string;
  scheduledAt: Date;
  status: ExamStatus;
  notes?: string;
  createdAt: Date;
  examType?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    durationTimeUnit: string;
    category: {
      id: string;
      name: string;
      description?: string;
    };
  };
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    dateOfBirth: Date;
    gender: string;
    phone?: string;
    email?: string;
    medicalRecordNumber: string;
  };
}

export type CreateExamDTO = z.infer<typeof createExamSchema>;
export type UpdateExamDTO = z.infer<typeof updateExamSchema>;
export type QueryExamsDTO = z.infer<typeof getExamsQuerySchema>;
