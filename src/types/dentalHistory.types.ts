import type { z } from 'zod';

import type {
  createDentalHistorySchema,
  updateDentalHistorySchema,
  getDentalHistoriesQuerySchema
} from '@/schemas/dentalHistory.schema';
import type { Odontogram } from '@/types/odontogram.types';
import type { Prescription } from '@/types/prescription.types';

export type OralHygieneLevel = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export type GumCondition =
  | 'HEALTHY'
  | 'GINGIVITIS'
  | 'PERIODONTITIS'
  | 'BLEEDING'
  | 'INFLAMMATION';

export interface DentalHistory {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  chiefComplaint?: string;
  diagnosis?: string;
  oralHygieneLevel: OralHygieneLevel;
  gumCondition: GumCondition;
  hasCalculus: boolean;
  hasPlaque: boolean;
  hasHalitosis: boolean;
  treatmentPlan?: string;
  nextVisitDate?: Date;
  recommendations?: string;
  odontogram?: Odontogram;
  prescription?: Prescription;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDentalHistoryDTO = z.infer<typeof createDentalHistorySchema>;
export type UpdateDentalHistoryDTO = z.infer<typeof updateDentalHistorySchema>;
export type QueryDentalHistoriesDTO = z.infer<
  typeof getDentalHistoriesQuerySchema
>;
