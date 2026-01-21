import type { z } from 'zod';

import type {
  changePasswordSchema,
  createUserSchema,
  getUsersQuerySchema,
  updateUserSchema
} from '@/schemas/user.schema';

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
