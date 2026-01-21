import { Router } from 'express';

import * as dentalHistoryController from '@/controllers/dentalHistory.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  createDentalHistorySchema,
  updateDentalHistorySchema,
  getDentalHistoriesQuerySchema,
  dentalHistoryIdSchema
} from '@/schemas/dentalHistory.schema';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(['dental-history:create']),
  validate(createDentalHistorySchema),
  dentalHistoryController.createDentalHistory
);

router.get(
  '/',
  authorize(['dental-history:read']),
  validate(getDentalHistoriesQuerySchema, 'query'),
  dentalHistoryController.getDentalHistories
);

router.get(
  '/appointment/:appointmentId',
  authorize(['dental-history:read']),
  dentalHistoryController.getDentalHistoryByAppointmentId
);

router.get(
  '/:id',
  authorize(['dental-history:read']),
  validate(dentalHistoryIdSchema, 'params'),
  dentalHistoryController.getDentalHistoryById
);

router.put(
  '/:id',
  authorize(['dental-history:update']),
  validate(dentalHistoryIdSchema, 'params'),
  validate(updateDentalHistorySchema),
  dentalHistoryController.updateDentalHistory
);

router.delete(
  '/:id',
  authorize(['dental-history:delete']),
  validate(dentalHistoryIdSchema, 'params'),
  dentalHistoryController.deleteDentalHistory
);

export default router;
