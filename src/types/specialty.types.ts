import type { z } from 'zod';

import type {
  createSpecialtySchema,
  updateSpecialtySchema
} from '@/schemas/specialty.schema';

export interface Specialty {
  id: string;
  name: string;
  description?: string | undefined;
  area: 'MEDICINA_GENERAL' | 'ODONTOLOGIA' | 'ADMINISTRATIVO';
  createdAt: Date;
}

export type CreateSpecialtyDTO = z.infer<typeof createSpecialtySchema>;
export type UpdateSpecialtyDTO = z.infer<typeof updateSpecialtySchema>;
