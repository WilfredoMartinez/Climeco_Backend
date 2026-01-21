import { Router } from 'express';

import {
  assignSurvey,
  getPatientSurveyById,
  getPatientSurveys
} from '@/controllers/patientSurvey.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  assignSurveySchema,
  getPatientSurveysQuerySchema,
  patientSurveyIdSchema
} from '@/schemas/patientSurvey.schema';

const patientSurveyRouter = Router();

patientSurveyRouter.use(authenticate);

patientSurveyRouter.post(
  '/',
  authorize(['patient-surveys:create']),
  validate(assignSurveySchema),
  assignSurvey
);

patientSurveyRouter.get(
  '/',
  authorize(['patient-surveys:read']),
  validate(getPatientSurveysQuerySchema, 'query'),
  getPatientSurveys
);

patientSurveyRouter.get(
  '/:id',
  authorize(['patient-surveys:read']),
  validate(patientSurveyIdSchema, 'params'),
  getPatientSurveyById
);

export default patientSurveyRouter;
