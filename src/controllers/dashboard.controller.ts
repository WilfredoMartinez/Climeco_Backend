import type { Request, Response, NextFunction } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess } from '@/lib/responses';
import * as dashboardService from '@/services/dashboard.service';

export const getDashboardStats = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const stats = await dashboardService.getDashboardStats();

    sendSuccess(
      res,
      stats,
      'Estadísticas del dashboard obtenidas exitosamente'
    );
  }
);
