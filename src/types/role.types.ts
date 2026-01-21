import type { z } from 'zod';

import type { createRoleSchema, updateRoleSchema } from '@/schemas/role.schema';

export interface Role {
  id: string;
  name: string;
  description?: string | undefined;
  createdAt: Date;
}

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;
