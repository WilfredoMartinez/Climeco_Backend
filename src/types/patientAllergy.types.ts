import type z from 'zod';

import type {
  assignAllergySchema,
  removeAllergySchema
} from '@/schemas/patientAllergy.schema';

export type PatientAllergy = {
  id: string;
  patientId: string;
  allergyTypeId: string;
  createdAt: Date;
};

export type PatientAllergies = {
  id: string;
  allergyName: string;
  allergyDescription?: string | null;
  createdAt: Date;
};

export type PatientAllergyRelation = {
  id: string;
  patientId: string;
  allergyTypeId: string;
  isActive: boolean;
  deletedAt?: Date | null;
};

export type AssignAllergyDTO = z.infer<typeof assignAllergySchema>;
export type RemoveAllergyDTO = z.infer<typeof removeAllergySchema>;
