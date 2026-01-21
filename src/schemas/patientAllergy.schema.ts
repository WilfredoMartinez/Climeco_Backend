import { z } from 'zod';

export const assignAllergySchema = z.object({
  allergyId: z.uuid('ID de alergia inválido')
});

export const removeAllergySchema = z.object({
  patientId: z.uuid('ID de paciente inválido'),
  patientAllergyId: z.uuid('ID de relación inválido')
});

export const getPatientAllergiesSchema = z.object({
  patientId: z.uuid('ID de paciente inválido')
});
