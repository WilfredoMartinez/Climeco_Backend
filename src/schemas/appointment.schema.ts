import { isBefore, parseISO, startOfDay } from 'date-fns';
import { z } from 'zod';

export const createAppointmentSchema = z
  .object({
    patientId: z.string().uuid('ID de paciente inválido'),
    userId: z.string().uuid('ID de profesional inválido'),
    date: z
      .string()
      .min(1, 'La fecha es requerida')
      .transform((val) => parseISO(val))
      .transform((date) => startOfDay(date))
      .refine(
        (date) => {
          const today = startOfDay(new Date());

          return date.getTime() >= today.getTime();
        },
        { message: 'La fecha de la cita no puede ser anterior a hoy' }
      ),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Formato de hora inválido (HH:mm)'
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Formato de hora inválido (HH:mm)'
      ),
    duration: z.number().int().positive('La duración debe ser mayor a 0'),
    status: z
      .enum([
        'SCHEDULED',
        'IN_VITALS',
        'IN_PROGRESS',
        'READY',
        'COMPLETED',
        'CANCELED',
        'NO_SHOW'
      ])
      .default('SCHEDULED'),
    notes: z
      .string()
      .max(1000, 'Las notas no pueden exceder 1000 caracteres')
      .trim()
      .optional()
      .nullable()
  })
  .refine(
    (data) => {
      const start = parseISO(`2000-01-01T${data.startTime}:00`);
      const end = parseISO(`2000-01-01T${data.endTime}:00`);

      return isBefore(start, end);
    },
    {
      message: 'La hora de inicio debe ser anterior a la hora de fin',
      path: ['endTime']
    }
  );

export const updateAppointmentSchema = z
  .object({
    patientId: z.string().uuid('ID de paciente inválido').optional(),
    userId: z.string().uuid('ID de profesional inválido').optional(),
    date: z
      .string()
      .min(1, 'La fecha es requerida')
      .transform((val) => parseISO(val))
      .transform((date) => startOfDay(date))
      .refine(
        (date) => {
          const today = startOfDay(new Date());

          return date.getTime() >= today.getTime();
        },
        { message: 'La fecha de la cita no puede ser anterior a hoy' }
      )
      .optional(),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Formato de hora inválido (HH:mm)'
      )
      .optional(),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Formato de hora inválido (HH:mm)'
      )
      .optional(),
    duration: z
      .number()
      .int()
      .positive('La duración debe ser mayor a 0')
      .optional(),
    status: z
      .enum([
        'SCHEDULED',
        'IN_VITALS',
        'IN_PROGRESS',
        'READY',
        'COMPLETED',
        'CANCELED',
        'NO_SHOW'
      ])
      .optional(),
    notes: z
      .string()
      .max(1000, 'Las notas no pueden exceder 1000 caracteres')
      .trim()
      .optional()
      .nullable()
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const start = parseISO(`2000-01-01T${data.startTime}:00`);
        const end = parseISO(`2000-01-01T${data.endTime}:00`);

        return isBefore(start, end);
      }

      return true;
    },
    {
      message: 'La hora de inicio debe ser anterior a la hora de fin',
      path: ['endTime']
    }
  );

export const cancelAppointmentSchema = z.object({
  notes: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const getAppointmentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  patientId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  status: z
    .enum([
      'SCHEDULED',
      'IN_VITALS',
      'IN_PROGRESS',
      'READY',
      'COMPLETED',
      'CANCELED',
      'NO_SHOW'
    ])
    .optional(),
  date: z.coerce.date().optional()
});

export const appointmentIdSchema = z.object({
  id: z.string().uuid('ID de cita inválido')
});

export const transitionNotesSchema = z.object({
  notes: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const transitionToVitalsSchema = z.object({
  // Signos vitales
  weight: z
    .number()
    .positive('El peso debe ser mayor a 0')
    .max(500, 'El peso no puede exceder 500 kg')
    .optional()
    .nullable(),
  height: z
    .number()
    .positive('La altura debe ser mayor a 0')
    .max(300, 'La altura no puede exceder 300 cm')
    .optional()
    .nullable(),
  temperature: z
    .number()
    .min(30, 'La temperatura debe ser mayor a 30°C')
    .max(45, 'La temperatura no puede exceder 45°C')
    .optional()
    .nullable(),
  systolicPressure: z
    .number()
    .int()
    .positive('La presión sistólica debe ser mayor a 0')
    .max(300, 'La presión sistólica no puede exceder 300 mmHg')
    .optional()
    .nullable(),
  diastolicPressure: z
    .number()
    .int()
    .positive('La presión diastólica debe ser mayor a 0')
    .max(200, 'La presión diastólica no puede exceder 200 mmHg')
    .optional()
    .nullable(),
  heartRate: z
    .number()
    .int()
    .positive('La frecuencia cardíaca debe ser mayor a 0')
    .max(300, 'La frecuencia cardíaca no puede exceder 300 bpm')
    .optional()
    .nullable(),
  respiratoryRate: z
    .number()
    .int()
    .positive('La frecuencia respiratoria debe ser mayor a 0')
    .max(100, 'La frecuencia respiratoria no puede exceder 100 rpm')
    .optional()
    .nullable(),
  oxygenSaturation: z
    .number()
    .min(0, 'La saturación de oxígeno debe ser al menos 0%')
    .max(100, 'La saturación de oxígeno no puede exceder 100%')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const updateVitalSignsSchema = z.object({
  // Signos vitales - todos opcionales para actualización parcial
  weight: z
    .number()
    .positive('El peso debe ser mayor a 0')
    .max(500, 'El peso no puede exceder 500 kg')
    .optional()
    .nullable(),
  height: z
    .number()
    .positive('La altura debe ser mayor a 0')
    .max(300, 'La altura no puede exceder 300 cm')
    .optional()
    .nullable(),
  temperature: z
    .number()
    .min(30, 'La temperatura debe ser mayor a 30°C')
    .max(45, 'La temperatura no puede exceder 45°C')
    .optional()
    .nullable(),
  systolicPressure: z
    .number()
    .int()
    .positive('La presión sistólica debe ser mayor a 0')
    .max(300, 'La presión sistólica no puede exceder 300 mmHg')
    .optional()
    .nullable(),
  diastolicPressure: z
    .number()
    .int()
    .positive('La presión diastólica debe ser mayor a 0')
    .max(200, 'La presión diastólica no puede exceder 200 mmHg')
    .optional()
    .nullable(),
  heartRate: z
    .number()
    .int()
    .positive('La frecuencia cardíaca debe ser mayor a 0')
    .max(300, 'La frecuencia cardíaca no puede exceder 300 bpm')
    .optional()
    .nullable(),
  respiratoryRate: z
    .number()
    .int()
    .positive('La frecuencia respiratoria debe ser mayor a 0')
    .max(100, 'La frecuencia respiratoria no puede exceder 100 rpm')
    .optional()
    .nullable(),
  oxygenSaturation: z
    .number()
    .min(0, 'La saturación de oxígeno debe ser al menos 0%')
    .max(100, 'La saturación de oxígeno no puede exceder 100%')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const availableSlotsSchema = z.object({
  date: z
    .string()
    .min(1, 'La fecha es requerida')
    .transform((val) => parseISO(val))
    .transform((date) => startOfDay(date))
    .refine(
      (date) => {
        const today = startOfDay(new Date());

        return date.getTime() >= today.getTime();
      },
      { message: 'La fecha no puede ser anterior a hoy' }
    ),
  userId: z.string().uuid('ID de profesional inválido')
});

// Schema para completar consulta dental (endpoint consolidado)
export const completeDentalConsultationSchema = z.object({
  dentalHistory: z.object({
    chiefComplaint: z
      .string()
      .max(500, 'La queja principal no puede exceder 500 caracteres')
      .trim()
      .optional()
      .nullable(),
    diagnosis: z
      .string()
      .max(500, 'El diagnóstico no puede exceder 500 caracteres')
      .trim()
      .optional()
      .nullable(),
    oralHygieneLevel: z
      .enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR'])
      .default('FAIR'),
    gumCondition: z
      .enum([
        'HEALTHY',
        'GINGIVITIS',
        'PERIODONTITIS',
        'BLEEDING',
        'INFLAMMATION'
      ])
      .default('HEALTHY'),
    hasCalculus: z.boolean().default(false),
    hasPlaque: z.boolean().default(false),
    hasHalitosis: z.boolean().default(false),
    treatmentPlan: z
      .string()
      .max(1000, 'El plan de tratamiento no puede exceder 1000 caracteres')
      .trim()
      .optional()
      .nullable(),
    nextVisitDate: z.coerce.date().optional().nullable(),
    recommendations: z
      .string()
      .max(1000, 'Las recomendaciones no pueden exceder 1000 caracteres')
      .trim()
      .optional()
      .nullable(),
    teeth: z
      .array(
        z.object({
          toothNumber: z
            .number()
            .int('El número de diente debe ser un entero')
            .min(1, 'El número de diente debe ser al menos 1')
            .max(48, 'El número de diente no puede ser mayor a 48'),
          position: z
            .string()
            .min(1, 'La posición es requerida')
            .max(10, 'La posición no puede exceder 10 caracteres')
            .trim(),
          quadrant: z
            .number()
            .int('El cuadrante debe ser un entero')
            .min(1, 'El cuadrante debe ser entre 1 y 4')
            .max(4, 'El cuadrante debe ser entre 1 y 4')
            .optional()
            .nullable(),
          affectedSurfaces: z
            .string()
            .max(
              100,
              'Las superficies afectadas no pueden exceder 100 caracteres'
            )
            .trim()
            .optional()
            .nullable(),
          condition: z
            .enum([
              'HEALTHY',
              'CARIES',
              'FILLED',
              'FRACTURED',
              'MISSING',
              'CROWN',
              'BRIDGE',
              'IMPLANT',
              'ROOT_CANAL',
              'EXTRACTION_NEEDED',
              'WISDOM_TOOTH'
            ])
            .default('HEALTHY'),
          notes: z
            .string()
            .max(500, 'Las notas no pueden exceder 500 caracteres')
            .trim()
            .optional()
            .nullable()
        })
      )
      .min(1, 'Debe incluir al menos un diente')
      .max(32, 'No puede incluir más de 32 dientes')
      .optional()
  }),
  prescription: z
    .object({
      generalInstructions: z
        .string()
        .max(
          1000,
          'Las instrucciones generales no pueden exceder 1000 caracteres'
        )
        .trim()
        .optional()
        .nullable(),
      dietRecommendations: z
        .string()
        .max(
          1000,
          'Las recomendaciones dietéticas no pueden exceder 1000 caracteres'
        )
        .trim()
        .optional()
        .nullable(),
      restrictions: z
        .string()
        .max(1000, 'Las restricciones no pueden exceder 1000 caracteres')
        .trim()
        .optional()
        .nullable(),
      validUntil: z.coerce.date().optional().nullable(),
      items: z
        .array(
          z.object({
            medicationId: z.string().uuid('ID de medicamento inválido'),
            quantity: z
              .number()
              .int('La cantidad debe ser un número entero')
              .positive('La cantidad debe ser mayor a 0'),
            dosage: z
              .string()
              .min(1, 'La dosis es requerida')
              .max(100, 'La dosis no puede exceder 100 caracteres')
              .trim(),
            frequency: z
              .string()
              .min(1, 'La frecuencia es requerida')
              .max(100, 'La frecuencia no puede exceder 100 caracteres')
              .trim(),
            duration: z
              .string()
              .min(1, 'La duración es requerida')
              .max(100, 'La duración no puede exceder 100 caracteres')
              .trim(),
            administration: z
              .string()
              .min(1, 'La vía de administración es requerida')
              .max(
                100,
                'La vía de administración no puede exceder 100 caracteres'
              )
              .trim(),
            instructions: z
              .string()
              .max(500, 'Las instrucciones no pueden exceder 500 caracteres')
              .trim()
              .optional()
              .nullable()
          })
        )
        .min(1, 'La receta debe tener al menos un medicamento')
        .max(20, 'La receta no puede tener más de 20 medicamentos')
    })
    .optional()
});
