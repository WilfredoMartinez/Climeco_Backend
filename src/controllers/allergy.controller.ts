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
  allergyIdSchema,
  createAllergySchema,
  getAllergiesQuerySchema,
  updateAllergySchema
} from '@/schemas/allergy.schema';
import * as allergyService from '@/services/allergy.service';

export const createAllergy = asyncHandler(
  async (
    req: Request<unknown, unknown, z.infer<typeof createAllergySchema>>,
    res: Response
  ): Promise<void> => {
    const { name, description } = req.body;
    const userId = req.currentUser!.id;

    const allergy = await allergyService.createAllergy(
      {
        name,
        description
      },
      userId
    );

    sendCreated(res, allergy, 'Alergia creada exitosamente');
  }
);

export const getAllergies = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, term } = req.query as unknown as z.infer<
      typeof getAllergiesQuerySchema
    >;

    const { allergies, total } = await allergyService.getAllAllergies({
      term: term ?? '',
      page: parseInt(String(page), 10),
      limit: parseInt(String(limit), 10)
    });

    sendPaginated(
      res,
      allergies,
      total,
      page,
      limit,
      'Alergias obtenidas exitosamente'
    );
  }
);

export const getAllergyById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof allergyIdSchema>;

    const allergy = await allergyService.getAllergyById(id);

    sendSuccess(res, allergy, 'Alergia obtenida exitosamente');
  }
);

export const updateAllergy = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof allergyIdSchema>;
    const userId = req.currentUser!.id;

    const allergy = await allergyService.updateAllergy(
      id,
      req.body as z.infer<typeof updateAllergySchema>,
      userId
    );

    sendSuccess(res, allergy, 'Alergia actualizada exitosamente');
  }
);

export const deleteAllergy = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof allergyIdSchema>;
    const userId = req.currentUser!.id;

    await allergyService.deleteAllergy(id, userId);

    sendNoContent(res);
  }
);
