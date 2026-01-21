import { Router } from 'express';

import * as prescriptionController from '@/controllers/prescription.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  createPrescriptionSchema,
  prescriptionIdSchema
} from '@/schemas/prescription.schema';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(['prescriptions:create']),
  validate(createPrescriptionSchema),
  prescriptionController.createPrescription
);

router.get(
  '/:id',
  authorize(['prescriptions:read']),
  validate(prescriptionIdSchema, 'params'),
  prescriptionController.getPrescriptionById
);

router.get(
  '/patient/:patientId',
  authorize(['prescriptions:read']),
  validate(
    prescriptionIdSchema.extend({
      patientId: prescriptionIdSchema.shape.id
    }),
    'params'
  ),
  prescriptionController.getPrescriptionsByPatient
);

export default router;
