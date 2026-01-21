import { z } from 'zod';

export const getPatientHistoryByAreaSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  area: z.enum(
    ['MEDICINA_GENERAL', 'ODONTOLOGIA'],
    'El área debe ser MEDICINA_GENERAL u ODONTOLOGIA'
  )
});

export type GetPatientHistoryByAreaDTO = z.infer<
  typeof getPatientHistoryByAreaSchema
>;
