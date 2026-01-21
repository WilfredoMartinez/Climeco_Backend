import type { z } from 'zod';

import type {
  genderEnum,
  documentTypeEnum,
  consentMechanismEnum
} from '@/schemas/patient.schema';

export type Gender = z.infer<typeof genderEnum>;
export type DocumentType = z.infer<typeof documentTypeEnum>;
export type ConsentMechanism = z.infer<typeof consentMechanismEnum>;
