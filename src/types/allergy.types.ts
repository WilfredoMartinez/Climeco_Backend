import type { z } from 'zod';

import type {
  createAllergySchema,
  updateAllergySchema
} from '@/schemas/allergy.schema';

export interface Allergy {
  id: string;
  name: string;
  description?: string | undefined;
  createdAt: Date;
}

export type CreateAllergyDTO = z.infer<typeof createAllergySchema>;
export type UpdateAllergyDTO = z.infer<typeof updateAllergySchema>;
