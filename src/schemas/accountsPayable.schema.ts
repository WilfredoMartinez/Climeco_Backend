import { z } from 'zod';

export const createAccountsPayableSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim(),
  totalAmount: z
    .number()
    .positive('El monto total debe ser mayor a 0')
    .finite('El monto total debe ser un número válido'),
  numberOfInstallments: z
    .number()
    .int('El número de cuotas debe ser un entero')
    .positive('El número de cuotas debe ser mayor a 0')
    .max(100, 'El número de cuotas no puede exceder 100')
});

export const updateAccountsPayableSchema = z.object({
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim()
    .optional(),
  totalAmount: z
    .number()
    .positive('El monto total debe ser mayor a 0')
    .finite('El monto total debe ser un número válido')
    .optional(),
  numberOfInstallments: z
    .number()
    .int('El número de cuotas debe ser un entero')
    .positive('El número de cuotas debe ser mayor a 0')
    .max(100, 'El número de cuotas no puede exceder 100')
    .optional(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional()
});

export const getAccountsPayableQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  patientId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']).optional(),
  term: z.string().trim().optional()
});

export const accountsPayableIdSchema = z.object({
  id: z.uuid('ID de cuenta por pagar inválido')
});
