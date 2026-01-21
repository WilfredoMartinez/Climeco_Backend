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
  createMedicationCategorySchema,
  getMedicationCategoriesQuerySchema
} from '@/schemas/medicationCategory.schema';
import * as medicationCategoryService from '@/services/medicationCategory.service';

export const createMedicationCategory = asyncHandler(
  async (
    req: Request<
      unknown,
      unknown,
      z.infer<typeof createMedicationCategorySchema>
    >,
    res: Response
  ): Promise<void> => {
    const { name, description } = req.body;
    const userId = req.currentUser!.id;

    const category = await medicationCategoryService.createMedicationCategory(
      { name, description },
      userId
    );

    sendCreated(res, category, 'Categoría de medicamento creada exitosamente');
  }
);

export const getMedicationCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, term } = req.query as unknown as z.infer<
      typeof getMedicationCategoriesQuerySchema
    >;

    const { medicationCategories, total } =
      await medicationCategoryService.getAllMedicationCategories({
        term: term ?? '',
        page: parseInt(String(page), 10),
        limit: parseInt(String(limit), 10)
      });

    sendPaginated(
      res,
      medicationCategories,
      total,
      page,
      limit,
      'Categorías de medicamentos obtenidas exitosamente'
    );
  }
);

export const getMedicationCategoryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const category =
      await medicationCategoryService.getMedicationCategoryById(id);

    sendSuccess(res, category);
  }
);

export const updateMedicationCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.currentUser!.id;

    const category = await medicationCategoryService.updateMedicationCategory(
      id,
      { name, description },
      userId
    );

    sendSuccess(
      res,
      category,
      'Categoría de medicamento actualizada exitosamente'
    );
  }
);

export const deleteMedicationCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    await medicationCategoryService.deleteMedicationCategory(id, userId);

    sendNoContent(res);
  }
);
