import type { Request, Response, NextFunction } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated
} from '@/lib/responses';
import * as examService from '@/services/exam.service';
import type {
  CreateExamDTO,
  UpdateExamDTO,
  QueryExamsDTO
} from '@/types/exam.types';

export const createExam = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body as CreateExamDTO;
    const userId = req.currentUser!.id;

    const exam = await examService.createExam(data, userId);

    sendCreated(res, exam);
  }
);

export const getExamById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const exam = await examService.getExamById(id);

    sendSuccess(res, exam);
  }
);

export const getExams = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = req.query as unknown as QueryExamsDTO;

    const { exams, total } = await examService.getExams({
      ...query,
      page: parseInt(String(query.page ?? 1), 10),
      limit: parseInt(String(query.limit ?? 10), 10)
    });

    sendPaginated(res, exams, total, query.page ?? 1, query.limit ?? 10);
  }
);

export const updateExam = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as UpdateExamDTO;
    const userId = req.currentUser!.id;

    const exam = await examService.updateExam(id, data, userId);

    sendSuccess(res, exam);
  }
);

export const deleteExam = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    await examService.deleteExam(id, userId);

    sendNoContent(res, 'Examen eliminado exitosamente');
  }
);
