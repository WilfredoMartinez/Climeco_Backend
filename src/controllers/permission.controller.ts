import type { Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess } from '@/lib/responses';
import * as permissionService from '@/services/permission.service';

export const getPermissions = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const permissions = await permissionService.getAllPermissions();

    sendSuccess(res, permissions, 'Permisos obtenidos exitosamente');
  }
);
