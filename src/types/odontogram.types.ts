import type { z } from 'zod';

import type {
  createOdontogramSchema,
  updateOdontogramSchema,
  updateToothSchema
} from '@/schemas/odontogram.schema';

export type ToothCondition =
  | 'HEALTHY'
  | 'CARIES'
  | 'FILLED'
  | 'FRACTURED'
  | 'MISSING'
  | 'CROWN'
  | 'BRIDGE'
  | 'IMPLANT'
  | 'ROOT_CANAL'
  | 'EXTRACTION_NEEDED'
  | 'WISDOM_TOOTH';

export interface Tooth {
  id: string;
  toothNumber: number;
  position: string;
  quadrant: number | null;
  affectedSurfaces: string | null;
  condition: ToothCondition;
  notes: string | null;
}

export interface Odontogram {
  id: string;
  dentalHistoryId: string;
  teeth: Tooth[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateOdontogramDTO = z.infer<typeof createOdontogramSchema>;
export type UpdateOdontogramDTO = z.infer<typeof updateOdontogramSchema>;
export type UpdateToothDTO = z.infer<typeof updateToothSchema>;
