import type { Request, Response, NextFunction } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated
} from '@/lib/responses';
import * as dentalHistoryService from '@/services/dentalHistory.service';
import type {
  CreateDentalHistoryDTO,
  UpdateDentalHistoryDTO,
  QueryDentalHistoriesDTO
} from '@/types/dentalHistory.types';

export const createDentalHistory = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body as CreateDentalHistoryDTO;
    const doctorId = req.currentUser!.id;

    const dentalHistory = await dentalHistoryService.createDentalHistory(
      data,
      doctorId
    );

    sendCreated(res, dentalHistory);
  }
);

export const getDentalHistoryById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const dentalHistory = await dentalHistoryService.getDentalHistoryById(id);

    sendSuccess(res, dentalHistory);
  }
);

export const getDentalHistoryByAppointmentId = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { appointmentId } = req.params;

    const dentalHistory =
      await dentalHistoryService.getDentalHistoryByAppointmentId(appointmentId);

    sendSuccess(res, dentalHistory);
  }
);

export const getDentalHistories = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = req.query as unknown as QueryDentalHistoriesDTO;

    const { dentalHistories, total } =
      await dentalHistoryService.getDentalHistories({
        ...query,
        page: parseInt(String(query.page ?? 1), 10),
        limit: parseInt(String(query.limit ?? 10), 10)
      });

    sendPaginated(
      res,
      dentalHistories,
      total,
      query.page ?? 1,
      query.limit ?? 10
    );
  }
);

export const updateDentalHistory = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as UpdateDentalHistoryDTO;
    const userId = req.currentUser!.id;

    const dentalHistory = await dentalHistoryService.updateDentalHistory(
      id,
      data,
      userId
    );

    sendSuccess(res, dentalHistory);
  }
);

export const deleteDentalHistory = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    await dentalHistoryService.deleteDentalHistory(id, userId);

    sendNoContent(res, 'Historial dental eliminado exitosamente');
  }
);
