import type { Request, Response, NextFunction } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess, sendCreated } from '@/lib/responses';
import * as prescriptionService from '@/services/prescription.service';
import type { CreatePrescriptionDTO } from '@/types/prescription.types';

export const createPrescription = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body as CreatePrescriptionDTO;
    const doctorId = req.currentUser!.id;

    const prescription = await prescriptionService.createPrescription(
      data,
      doctorId
    );

    sendCreated(res, prescription);
  }
);

export const getPrescriptionById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const prescription = await prescriptionService.getPrescriptionById(id);

    sendSuccess(res, prescription);
  }
);

export const getPrescriptionsByPatient = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { patientId } = req.params;

    const prescriptions =
      await prescriptionService.getPrescriptionsByPatient(patientId);

    sendSuccess(res, prescriptions);
  }
);
