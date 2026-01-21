import type { Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess, sendNoContent, sendCreated } from '@/lib/responses';
import * as patientAllergyService from '@/services/patientAllergy.service';
import type { AssignAllergyDTO } from '@/types/patientAllergy.types';

export const assignAllergy = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { patientId } = req.params;
    const data = req.body as AssignAllergyDTO;
    const userId = req.currentUser!.id;

    const { id } = await patientAllergyService.assignAllergy(
      patientId,
      data,
      userId
    );

    sendCreated(res, { id }, 'Alergia asignada exitosamente');
  }
);

export const removeAllergy = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { patientId, patientAllergyId } = req.params;
    const userId = req.currentUser!.id;

    await patientAllergyService.removeAllergy(
      patientId,
      patientAllergyId,
      userId
    );

    sendNoContent(res);
  }
);

export const getPatientAllergies = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { patientId } = req.params;

    const allergies =
      await patientAllergyService.getPatientAllergies(patientId);

    sendSuccess(res, allergies, 'Alergias obtenidas exitosamente', 200);
  }
);
