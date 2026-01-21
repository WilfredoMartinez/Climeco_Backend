import { z } from 'zod';

export const genderEnum = z.enum(['M', 'F']);
export const documentTypeEnum = z.enum(['DUI', 'NIT', 'PASSPORT', 'NONE']);
export const consentMechanismEnum = z.enum([
  'FIRMA_FISICA',
  'ACEPTACION_DIGITAL',
  'APODERADO_LEGAL'
]);

export const patientIdSchema = z.object({
  patientId: z.uuid('ID de paciente inválido')
});

export const createPatientSchema = z
  .object({
    firstName: z
      .string('El nombre es obligatorio')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .trim(),
    lastName: z
      .string('El apellido es obligatorio')
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(100, 'El apellido no puede exceder 100 caracteres')
      .trim(),
    documentType: documentTypeEnum,
    documentNumber: z
      .string('El número de documento es obligatorio')
      .min(1, 'El número de documento no puede estar vacío')
      .max(500, 'El número de documento no puede exceder 500 caracteres')
      .trim(),
    dateOfBirth: z.iso
      .datetime('Fecha de nacimiento inválida')
      .or(z.iso.date('Fecha de nacimiento inválida'))
      .transform((str: string): Date => new Date(str)),
    isMinor: z.boolean('Debe indicar si es menor de edad'),
    guardianName: z
      .string()
      .min(2, 'El nombre del encargado debe tener al menos 2 caracteres')
      .max(255, 'El nombre del encargado no puede exceder 255 caracteres')
      .trim()
      .optional()
      .nullable(),
    gender: genderEnum,
    email: z
      .email('El correo electrónico no es válido')
      .max(150, 'El correo no puede exceder 150 caracteres')
      .trim()
      .optional()
      .nullable(),
    phone: z
      .string()
      .min(8, 'El teléfono debe tener al menos 8 caracteres')
      .max(20, 'El teléfono no puede exceder 20 caracteres')
      .trim()
      .optional()
      .nullable(),
    address: z
      .string()
      .max(255, 'La dirección no puede exceder 255 caracteres')
      .trim()
      .optional()
      .nullable(),
    consentMechanism: consentMechanismEnum,
    consentAcceptedAt: z.iso
      .datetime('Fecha de consentimiento inválida')
      .or(z.iso.date('Fecha de consentimiento inválida'))
      .transform((str: string): Date => new Date(str)),
    medicalRecordNumber: z
      .string()
      .min(1, 'El número de historia clínica no puede estar vacío')
      .max(50, 'El número de historia clínica no puede exceder 50 caracteres')
      .trim()
      .optional()
      .nullable()
  })
  .refine(
    (data) => {
      if (
        !data.isMinor &&
        (!data.documentNumber || data.documentNumber.trim().length === 0)
      ) {
        return false;
      }

      return true;
    },
    {
      message: 'Los mayores de edad deben tener número de documento',
      path: ['documentNumber']
    }
  );

export const updatePatientSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .trim()
      .optional(),
    lastName: z
      .string()
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(100, 'El apellido no puede exceder 100 caracteres')
      .trim()
      .optional(),
    documentType: documentTypeEnum.optional(),
    documentNumber: z
      .string()
      .min(1, 'El número de documento no puede estar vacío')
      .max(500, 'El número de documento no puede exceder 500 caracteres')
      .trim()
      .optional(),
    dateOfBirth: z.iso
      .datetime('Fecha de nacimiento inválida')
      .or(z.iso.date('Fecha de nacimiento inválida'))
      .transform((str: string): Date => new Date(str))
      .optional(),
    isMinor: z.boolean().optional(),
    guardianName: z
      .string()
      .min(2, 'El nombre del encargado debe tener al menos 2 caracteres')
      .max(255, 'El nombre del encargado no puede exceder 255 caracteres')
      .trim()
      .nullable()
      .optional(),
    gender: genderEnum.optional(),
    email: z
      .email('El correo electrónico no es válido')
      .max(150, 'El correo no puede exceder 150 caracteres')
      .trim()
      .nullable()
      .optional(),
    phone: z
      .string()
      .min(8, 'El teléfono debe tener al menos 8 caracteres')
      .max(20, 'El teléfono no puede exceder 20 caracteres')
      .trim()
      .nullable()
      .optional(),
    address: z
      .string()
      .max(255, 'La dirección no puede exceder 255 caracteres')
      .trim()
      .nullable()
      .optional(),
    consentMechanism: consentMechanismEnum.optional()
  })
  .strict();

export const listPatientsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  searchBy: z
    .enum(['name', 'documentNumber', 'medicalRecordNumber'])
    .optional()
    .default('name')
});
