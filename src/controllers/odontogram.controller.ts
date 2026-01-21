import type { Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '@/lib/responses';
import {
  createOdontogramSchema,
  dentalHistoryIdParamSchema,
  odontogramIdSchema,
  toothIdSchema,
  updateOdontogramSchema,
  updateToothSchema
} from '@/schemas/odontogram.schema';
import * as odontogramService from '@/services/odontogram.service';

export const createOdontogram = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createOdontogramSchema.parse(req.body);
    const userId = req.currentUser!.id;

    const odontogram = await odontogramService.createOdontogram(body, userId);

    return sendCreated(res, odontogram, 'Odontograma creado exitosamente');
  }
);

export const getOdontogramByDentalHistoryId = asyncHandler(
  async (req: Request, res: Response) => {
    const { dentalHistoryId } = dentalHistoryIdParamSchema.parse(req.params);

    const odontogram =
      await odontogramService.getOdontogramByDentalHistoryId(dentalHistoryId);

    return sendSuccess(res, odontogram, 'Odontograma recuperado exitosamente');
  }
);

export const getOdontogramById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = odontogramIdSchema.parse(req.params);

    const odontogram = await odontogramService.getOdontogramById(id);

    return sendSuccess(res, odontogram, 'Odontograma recuperado exitosamente');
  }
);

export const updateOdontogram = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = odontogramIdSchema.parse(req.params);
    const body = updateOdontogramSchema.parse(req.body);
    const userId = req.currentUser!.id;

    const odontogram = await odontogramService.updateOdontogram(
      id,
      body,
      userId
    );

    return sendSuccess(res, odontogram, 'Odontograma actualizado exitosamente');
  }
);

export const updateTooth = asyncHandler(async (req: Request, res: Response) => {
  const { id: odontogramId } = odontogramIdSchema.parse(req.params);
  const { toothId } = toothIdSchema.parse(req.params);
  const body = updateToothSchema.parse(req.body);
  const userId = req.currentUser!.id;

  const odontogram = await odontogramService.updateToothInOdontogram(
    odontogramId,
    toothId,
    body,
    userId
  );

  return sendSuccess(res, odontogram, 'Diente actualizado exitosamente');
});

export const deleteOdontogram = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = odontogramIdSchema.parse(req.params);
    const userId = req.currentUser!.id;

    await odontogramService.deleteOdontogram(id, userId);

    return sendNoContent(res);
  }
);
