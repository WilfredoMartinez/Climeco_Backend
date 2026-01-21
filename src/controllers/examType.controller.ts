import type { Request, Response, NextFunction } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated
} from '@/lib/responses';
import * as examTypeService from '@/services/examType.service';
import type {
  CreateExamTypeDTO,
  UpdateExamTypeDTO,
  QueryExamTypesDTO
} from '@/types/examType.types';

export const createExamType = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body as CreateExamTypeDTO;
    const userId = req.currentUser!.id;

    const examType = await examTypeService.createExamType(data, userId);

    sendCreated(res, examType);
  }
);

export const getExamTypeById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const examType = await examTypeService.getExamTypeById(id);

    sendSuccess(res, examType);
  }
);

export const getExamTypes = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = req.query as unknown as QueryExamTypesDTO;

    const { examTypes, total } = await examTypeService.getExamTypes({
      ...query,
      page: parseInt(String(query.page ?? 1), 10),
      limit: parseInt(String(query.limit ?? 10), 10)
    });

    sendPaginated(res, examTypes, total, query.page ?? 1, query.limit ?? 10);
  }
);

export const updateExamType = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as UpdateExamTypeDTO;
    const userId = req.currentUser!.id;

    const examType = await examTypeService.updateExamType(id, data, userId);

    sendSuccess(res, examType);
  }
);

export const deleteExamType = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    await examTypeService.deleteExamType(id, userId);

    sendNoContent(res, 'Tipo de examen eliminado exitosamente');
  }
);
