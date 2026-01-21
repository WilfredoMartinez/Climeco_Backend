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
  createExamCategorySchema,
  examCategoryIdSchema,
  getExamCategoriesQuerySchema,
  updateExamCategorySchema
} from '@/schemas/examCategory.schema';
import * as examCategoryService from '@/services/examCategory.service';

export const createExamCategory = asyncHandler(
  async (
    req: Request<unknown, unknown, z.infer<typeof createExamCategorySchema>>,
    res: Response
  ): Promise<void> => {
    const userId = req.currentUser!.id;

    const examCategory = await examCategoryService.createExamCategory(
      req.body,
      userId
    );

    sendCreated(res, examCategory, 'Categoría de examen creada exitosamente');
  }
);

export const getExamCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, term } = req.query as unknown as z.infer<
      typeof getExamCategoriesQuerySchema
    >;

    const { examCategories, total } =
      await examCategoryService.getAllExamCategories({
        page: parseInt(String(page), 10) || 1,
        limit: parseInt(String(limit), 10) || 10,
        term
      });

    sendPaginated(
      res,
      examCategories,
      total,
      Number(page) || 1,
      Number(limit) || 10,
      'Categorías de examen obtenidas exitosamente'
    );
  }
);

export const getExamCategoryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof examCategoryIdSchema>;

    const examCategory = await examCategoryService.getExamCategoryById(id);

    sendSuccess(res, examCategory, 'Categoría de examen obtenida exitosamente');
  }
);

export const updateExamCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof examCategoryIdSchema>;
    const userId = req.currentUser!.id;

    const examCategory = await examCategoryService.updateExamCategory(
      id,
      req.body as z.infer<typeof updateExamCategorySchema>,
      userId
    );

    sendSuccess(
      res,
      examCategory,
      'Categoría de examen actualizada exitosamente'
    );
  }
);

export const deleteExamCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof examCategoryIdSchema>;
    const userId = req.currentUser!.id;

    await examCategoryService.deleteExamCategory(id, userId);

    sendNoContent(res, 'Categoría de examen eliminada exitosamente');
  }
);
