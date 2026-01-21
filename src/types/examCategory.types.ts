import type { z } from 'zod';

import type {
  createExamCategorySchema,
  updateExamCategorySchema
} from '@/schemas/examCategory.schema';

export interface ExamCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export type CreateExamCategoryDTO = z.infer<typeof createExamCategorySchema>;
export type UpdateExamCategoryDTO = z.infer<typeof updateExamCategorySchema>;
