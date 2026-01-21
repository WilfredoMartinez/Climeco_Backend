import type { z } from 'zod';

import type {
  createExamTypeSchema,
  updateExamTypeSchema,
  getExamTypesQuerySchema
} from '@/schemas/examType.schema';

export type TimeUnit = 'MINUTES' | 'HOURS' | 'DAYS';

export interface ExamType {
  id: string;
  examCategoryId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  durationTimeUnit: TimeUnit;
  createdAt: Date;
}

export type CreateExamTypeDTO = z.infer<typeof createExamTypeSchema>;
export type UpdateExamTypeDTO = z.infer<typeof updateExamTypeSchema>;
export type QueryExamTypesDTO = z.infer<typeof getExamTypesQuerySchema>;
