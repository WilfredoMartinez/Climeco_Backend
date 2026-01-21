import type { z } from 'zod';

import type {
  createPrescriptionSchema,
  createPrescriptionItemSchema
} from '@/schemas/prescription.schema';

export interface Prescription {
  id: string;
  medicalHistoryId?: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  prescriptionNumber: string;
  generalInstructions?: string;
  dietRecommendations?: string;
  restrictions?: string;
  validUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  prescriptionItems?: PrescriptionItem[];
  patient?: {
    firstName: string;
    lastName: string;
    medicalRecordNumber: string;
  };
  doctor?: {
    fullName: string;
  };
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicationId: string;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  administration: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
  medication?: {
    name: string;
    measureUnit: string;
  };
}

export type CreatePrescriptionDTO = z.infer<typeof createPrescriptionSchema>;
export type CreatePrescriptionItemDTO = z.infer<
  typeof createPrescriptionItemSchema
>;
