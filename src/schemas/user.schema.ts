import { z } from 'zod';

export const createUserSchema = z.object({
  roleId: z.string().uuid('ID de rol inválido'),
  specialtyId: z.string().uuid('ID de especialidad inválido'),
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(60, 'El username no puede exceder 60 caracteres')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    ),
  fullName: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .max(255, 'El nombre completo no puede exceder 255 caracteres')
    .trim(),
  phone: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .trim()
    .optional()
    .nullable()
});

export const updateUserSchema = z.object({
  roleId: z.string().uuid('ID de rol inválido').optional(),
  specialtyId: z.string().uuid('ID de especialidad inválido').optional(),
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(60, 'El username no puede exceder 60 caracteres')
    .trim()
    .toLowerCase()
    .optional(),
  fullName: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .max(255, 'El nombre completo no puede exceder 255 caracteres')
    .trim()
    .optional(),
  phone: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .trim()
    .optional()
    .nullable(),
  isActive: z.boolean().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
    )
});

export const getUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  roleId: z.string().uuid().optional(),
  specialtyId: z.string().uuid().optional(),
  area: z
    .union([
      z.enum(['MEDICINA_GENERAL', 'ODONTOLOGIA', 'ADMINISTRATIVO']),
      z.array(z.enum(['MEDICINA_GENERAL', 'ODONTOLOGIA', 'ADMINISTRATIVO']))
    ])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),
  search: z.string().optional(),
  isActive: z
    .string()
    .transform((val) => val === 'true')
    .optional()
});

export const userIdSchema = z.object({
  id: z.string().uuid('ID de usuario inválido')
});
