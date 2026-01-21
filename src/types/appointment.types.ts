import type { z } from 'zod';

import type {
  createAppointmentSchema,
  updateAppointmentSchema,
  cancelAppointmentSchema,
  getAppointmentsQuerySchema,
  transitionNotesSchema,
  transitionToVitalsSchema,
  updateVitalSignsSchema,
  availableSlotsSchema
} from '@/schemas/appointment.schema';

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'IN_VITALS'
  | 'IN_PROGRESS'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELED'
  | 'NO_SHOW';

export interface Appointment {
  id: string;
  patientId: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  patient: {
    firstName: string;
    lastName: string;
    documentNumber: string;
    medicalRecordNumber: string;
  };
  user: {
    fullName: string;
  };
}

export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentSchema>;
export type CancelAppointmentDTO = z.infer<typeof cancelAppointmentSchema>;
export type QueryAppointmentsDTO = z.infer<typeof getAppointmentsQuerySchema>;
export type TransitionNotesDTO = z.infer<typeof transitionNotesSchema>;
export type TransitionToVitalsDTO = z.infer<typeof transitionToVitalsSchema>;
export type UpdateVitalSignsDTO = z.infer<typeof updateVitalSignsSchema>;
export type AvailableSlotsQueryDTO = z.infer<typeof availableSlotsSchema>;

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}
