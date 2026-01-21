import type z from 'zod';

import type {
  createPatientSchema,
  listPatientsSchema,
  updatePatientSchema
} from '@/schemas/patient.schema';
import type {
  ConsentMechanism,
  DocumentType,
  Gender
} from '@/types/patient.enums';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate: Date;
  isMinor: boolean;
  guardianName?: string | null;
  gender: Gender;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  consentMechanism: ConsentMechanism;
  consentAcceptedAt: Date;
  medicalRecordNumber?: string;
  createdAt: Date;
}

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;
export type UpdatePatientDTO = z.infer<typeof updatePatientSchema>;
export type ListPatientsQuery = z.infer<typeof listPatientsSchema>;
