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
  createSpecialtySchema,
  getSpecialtiesQuerySchema,
  specialtyIdSchema,
  updateSpecialtySchema
} from '@/schemas/specialty.schema';
import * as specialtyService from '@/services/specialty.service';

export const createSpecialty = asyncHandler(
  async (
    req: Request<unknown, unknown, z.infer<typeof createSpecialtySchema>>,
    res: Response
  ): Promise<void> => {
    const { name, description, area } = req.body;
    const userId = req.currentUser!.id;

    const specialty = await specialtyService.createSpecialty(
      {
        name,
        description,
        area
      },
      userId
    );

    sendCreated(res, specialty, 'Especialidad creada exitosamente');
  }
);

export const getSpecialties = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, term, area } = req.query as unknown as z.infer<
      typeof getSpecialtiesQuerySchema
    >;

    const { specialties, total } = await specialtyService.getAllSpecialties({
      term: term ?? '',
      area: area ?? undefined,
      page: parseInt(String(page), 10),
      limit: parseInt(String(limit), 10)
    });

    sendPaginated(
      res,
      specialties,
      total,
      page,
      limit,
      'Especialidades obtenidas exitosamente'
    );
  }
);

export const getSpecialtyById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof specialtyIdSchema>;

    const specialty = await specialtyService.getSpecialtyById(id);

    sendSuccess(res, specialty, 'Especialidad obtenida exitosamente');
  }
);

export const updateSpecialty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof specialtyIdSchema>;
    const userId = req.currentUser!.id;

    const specialty = await specialtyService.updateSpecialty(
      id,
      req.body as z.infer<typeof updateSpecialtySchema>,
      userId
    );

    sendSuccess(res, specialty, 'Especialidad actualizada exitosamente');
  }
);

export const deleteSpecialty = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof specialtyIdSchema>;
    const userId = req.currentUser!.id;

    await specialtyService.deleteSpecialty(id, userId);

    sendNoContent(res);
  }
);
