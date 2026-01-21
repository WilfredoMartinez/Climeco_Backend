import { Router } from 'express';

import * as patientHistoryController from '@/controllers/patientHistory.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import { getPatientHistoryByAreaSchema } from '@/schemas/patientHistory.schema';

const router = Router();

router.use(authenticate);

// GET /api/v1/patient-history?patientId={uuid}&area={MEDICINA_GENERAL|ODONTOLOGIA}
router.get(
  '/',
  authorize(['dental-history:read', 'patients:read']),
  validate(getPatientHistoryByAreaSchema, 'query'),
  patientHistoryController.getPatientHistoryByArea
);

export default router;
