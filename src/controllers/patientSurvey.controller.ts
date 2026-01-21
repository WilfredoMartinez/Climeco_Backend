import type { Request, Response } from 'express';
import type z from 'zod';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendCreated, sendSuccess } from '@/lib/responses';
import type { getPatientSurveysQuerySchema } from '@/schemas/patientSurvey.schema';
import * as patientSurveyService from '@/services/patientSurvey.service';
import type { AssignSurveyDTO } from '@/types/patientSurvey.types';

export const assignSurvey = asyncHandler(
  async (
    req: Request<object, object, AssignSurveyDTO>,
    res: Response
  ): Promise<void> => {
    const userId = req.currentUser!.id;
    const result = await patientSurveyService.assignSurveyToPatient(
      req.body,
      userId
    );

    sendCreated(res, result, 'Cuestionario asignado exitosamente');
  }
);

export const getPatientSurveys = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as z.infer<
      typeof getPatientSurveysQuerySchema
    >;

    const result = await patientSurveyService.getPatientSurveys({
      ...query,
      page: parseInt(String(query.page), 10),
      limit: parseInt(String(query.limit), 10)
    });

    sendSuccess(res, result);
  }
);

export const getPatientSurveyById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await patientSurveyService.getPatientSurveyById(
      req.params.id
    );

    sendSuccess(res, result);
  }
);
