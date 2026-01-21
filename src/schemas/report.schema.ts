import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { z } from 'zod';

const baseDateRangeSchema = z.object({
  startDate: z
    .string()
    .min(1, 'La fecha de inicio es requerida')
    .transform((val) => {
      const date = parseISO(val);

      return startOfDay(date);
    }),
  endDate: z
    .string()
    .min(1, 'La fecha de fin es requerida')
    .transform((val) => {
      const date = parseISO(val);

      return endOfDay(date);
    })
});

const validateDateRange = (data: {
  startDate: Date;
  endDate: Date;
}): boolean => {
  // Con endOfDay, endDate siempre será mayor o igual a startDate si son el mismo día
  return data.startDate.getTime() <= data.endDate.getTime();
};

export const dateRangeSchema = baseDateRangeSchema.refine(validateDateRange, {
  message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
  path: ['endDate']
});

export const appointmentsReportSchema = baseDateRangeSchema
  .extend({
    doctorId: z.string().uuid().optional(),
    patientId: z.string().uuid().optional()
  })
  .refine(validateDateRange, {
    message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
    path: ['endDate']
  });

export const paymentsReportSchema = baseDateRangeSchema
  .extend({
    patientId: z.string().uuid().optional()
  })
  .refine(validateDateRange, {
    message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
    path: ['endDate']
  });

export const accountsReceivableReportSchema = baseDateRangeSchema
  .extend({
    patientId: z.string().uuid().optional()
  })
  .refine(validateDateRange, {
    message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
    path: ['endDate']
  });

export const patientsReportSchema = dateRangeSchema;

export const examsReportSchema = baseDateRangeSchema
  .extend({
    examTypeId: z.string().uuid().optional(),
    status: z
      .enum(['PENDING', 'COMPLETED', 'DELIVERED', 'CANCELLED'])
      .optional()
  })
  .refine(validateDateRange, {
    message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
    path: ['endDate']
  });

export const surveysReportSchema = dateRangeSchema;
