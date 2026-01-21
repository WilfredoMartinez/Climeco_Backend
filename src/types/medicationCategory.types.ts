import type { z } from 'zod';

import type {
  createMedicationCategorySchema,
  updateMedicationCategorySchema
} from '@/schemas/medicationCategory.schema';

export interface MedicationCategory {
  id: string;
  name: string;
  description?: string | undefined;
  createdAt: Date;
}

export type CreateMedicationCategoryDTO = z.infer<
  typeof createMedicationCategorySchema
>;
export type UpdateMedicationCategoryDTO = z.infer<
  typeof updateMedicationCategorySchema
>;
