import type { Request, Response } from 'express';
import type z from 'zod';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendCreated,
  sendNoContent,
  sendPaginated,
  sendSuccess
} from '@/lib/responses';
import type {
  createRoleSchema,
  getRolesQuerySchema,
  roleIdSchema,
  updateRoleSchema
} from '@/schemas/role.schema';
import * as roleService from '@/services/role.service';

export const createRole = asyncHandler(
  async (
    req: Request<unknown, unknown, z.infer<typeof createRoleSchema>>,
    res: Response
  ): Promise<void> => {
    const { name, description } = req.body;
    const userId = req.currentUser!.id;

    const role = await roleService.createRole({ name, description }, userId);

    sendCreated(res, role, 'Rol creado exitosamente');
  }
);

export const getRoles = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, term } = req.query as unknown as z.infer<
      typeof getRolesQuerySchema
    >;

    const { roles, total } = await roleService.getAllRoles({
      term: term ?? '',
      page: parseInt(String(page), 10),
      limit: parseInt(String(limit), 10)
    });

    sendPaginated(
      res,
      roles,
      total,
      page,
      limit,
      'Roles obtenidos exitosamente'
    );
  }
);

export const getRoleById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof roleIdSchema>;

    const role = await roleService.getRoleById(id);

    sendSuccess(res, role, 'Rol obtenido exitosamente');
  }
);

export const updateRole = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof roleIdSchema>;
    const userId = req.currentUser!.id;

    const role = await roleService.updateRole(
      id,
      req.body as z.infer<typeof updateRoleSchema>,
      userId
    );

    sendSuccess(res, role, 'Rol actualizado exitosamente');
  }
);

export const deleteRole = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof roleIdSchema>;
    const userId = req.currentUser!.id;

    await roleService.deleteRole(id, userId);

    sendNoContent(res);
  }
);
