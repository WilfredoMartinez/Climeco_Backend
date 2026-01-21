import type { NextFunction, Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess } from '@/lib/responses';
import type { GetPatientHistoryByAreaDTO } from '@/schemas/patientHistory.schema';
import * as patientHistoryService from '@/services/patientHistory.service';

export const getPatientHistoryByArea = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { patientId, area } =
      req.query as unknown as GetPatientHistoryByAreaDTO;

    const histories = await patientHistoryService.getPatientHistoryByArea(
      patientId,
      area
    );

    sendSuccess(res, histories, 'Historiales obtenidos exitosamente');
  }
);
