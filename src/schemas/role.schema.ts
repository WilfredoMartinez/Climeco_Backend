import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre no puede exceder 60 caracteres')
    .trim(),
  description: z
    .string()
    .max(255, 'La descripción no puede exceder 255 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const updateRoleSchema = createRoleSchema.partial();

export const getRolesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  term: z.string().trim().optional()
});

export const roleIdSchema = z.object({
  id: z.uuid('ID de rol inválido')
});
