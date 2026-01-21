import { Router } from 'express';

import * as examTypeController from '@/controllers/examType.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  createExamTypeSchema,
  updateExamTypeSchema,
  getExamTypesQuerySchema,
  examTypeIdSchema
} from '@/schemas/examType.schema';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(['exam-types:create']),
  validate(createExamTypeSchema),
  examTypeController.createExamType
);

router.get(
  '/',
  authorize(['exam-types:read']),
  validate(getExamTypesQuerySchema, 'query'),
  examTypeController.getExamTypes
);

router.get(
  '/:id',
  authorize(['exam-types:read']),
  validate(examTypeIdSchema, 'params'),
  examTypeController.getExamTypeById
);

router.put(
  '/:id',
  authorize(['exam-types:update']),
  validate(examTypeIdSchema, 'params'),
  validate(updateExamTypeSchema),
  examTypeController.updateExamType
);

router.delete(
  '/:id',
  authorize(['exam-types:delete']),
  validate(examTypeIdSchema, 'params'),
  examTypeController.deleteExamType
);

export default router;
