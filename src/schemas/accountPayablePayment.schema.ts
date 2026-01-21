import { z } from 'zod';

export const createPaymentSchema = z.object({
  accountsPayableId: z.string().uuid('ID de cuenta por pagar inválido'),
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .finite('El monto debe ser un número válido'),
  installmentNumber: z
    .number()
    .int('El número de cuota debe ser un entero')
    .positive('El número de cuota debe ser mayor a 0')
    .optional()
    .nullable(),
  isPartial: z.boolean().default(false),
  paymentDate: z.coerce.date().optional(),
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const updatePaymentSchema = z.object({
  amount: z
    .number()
    .positive('El monto debe ser mayor a 0')
    .finite('El monto debe ser un número válido')
    .optional(),
  installmentNumber: z
    .number()
    .int('El número de cuota debe ser un entero')
    .positive('El número de cuota debe ser mayor a 0')
    .optional()
    .nullable(),
  isPartial: z.boolean().optional(),
  paymentDate: z.coerce.date().optional(),
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const getPaymentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  accountsPayableId: z.string().uuid().optional()
});

export const paymentIdSchema = z.object({
  id: z.uuid('ID de pago inválido')
});
