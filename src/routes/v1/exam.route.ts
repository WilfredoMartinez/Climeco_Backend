import { Router } from 'express';

import * as examController from '@/controllers/exam.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  createExamSchema,
  updateExamSchema,
  getExamsQuerySchema,
  examIdSchema
} from '@/schemas/exam.schema';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(['exams:create']),
  validate(createExamSchema),
  examController.createExam
);

router.get(
  '/',
  authorize(['exams:read']),
  validate(getExamsQuerySchema, 'query'),
  examController.getExams
);

router.get(
  '/:id',
  authorize(['exams:read']),
  validate(examIdSchema, 'params'),
  examController.getExamById
);

router.put(
  '/:id',
  authorize(['exams:update']),
  validate(examIdSchema, 'params'),
  validate(updateExamSchema),
  examController.updateExam
);

router.delete(
  '/:id',
  authorize(['exams:delete']),
  validate(examIdSchema, 'params'),
  examController.deleteExam
);

export default router;
