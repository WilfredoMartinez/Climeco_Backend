import { Router } from 'express';

import {
  createExamCategory,
  deleteExamCategory,
  getExamCategories,
  getExamCategoryById,
  updateExamCategory
} from '@/controllers/examCategory.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  createExamCategorySchema,
  examCategoryIdSchema,
  getExamCategoriesQuerySchema,
  updateExamCategorySchema
} from '@/schemas/examCategory.schema';

const examCategoriesRouter = Router();

examCategoriesRouter.use(authenticate);

examCategoriesRouter.get(
  '/',
  authorize(['exam-categories:read']),
  validate(getExamCategoriesQuerySchema, 'query'),
  getExamCategories
);

examCategoriesRouter.post(
  '/',
  authorize(['exam-categories:create']),
  validate(createExamCategorySchema),
  createExamCategory
);

examCategoriesRouter.get(
  '/:id',
  authorize(['exam-categories:read']),
  validate(examCategoryIdSchema, 'params'),
  getExamCategoryById
);

examCategoriesRouter.put(
  '/:id',
  authorize(['exam-categories:update']),
  validateMultiple({
    params: examCategoryIdSchema,
    body: updateExamCategorySchema
  }),
  updateExamCategory
);

examCategoriesRouter.delete(
  '/:id',
  authorize(['exam-categories:delete']),
  validate(examCategoryIdSchema, 'params'),
  deleteExamCategory
);

export default examCategoriesRouter;
