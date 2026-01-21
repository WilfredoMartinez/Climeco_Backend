import { Router } from 'express';

import {
  createMedicationCategory,
  deleteMedicationCategory,
  getMedicationCategories,
  getMedicationCategoryById,
  updateMedicationCategory
} from '@/controllers/medicationCategory.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  createMedicationCategorySchema,
  getMedicationCategoriesQuerySchema,
  medicationCategoryIdSchema,
  updateMedicationCategorySchema
} from '@/schemas/medicationCategory.schema';

const medicationCategoriesRouter = Router();

medicationCategoriesRouter.use(authenticate);

medicationCategoriesRouter.get(
  '/',
  authorize(['medication-categories:read']),
  validate(getMedicationCategoriesQuerySchema, 'query'),
  getMedicationCategories
);

medicationCategoriesRouter.post(
  '/',
  authorize(['medication-categories:create']),
  validate(createMedicationCategorySchema),
  createMedicationCategory
);

medicationCategoriesRouter.get(
  '/:id',
  authorize(['medication-categories:read']),
  validate(medicationCategoryIdSchema, 'params'),
  getMedicationCategoryById
);

medicationCategoriesRouter.put(
  '/:id',
  authorize(['medication-categories:update']),
  validate(medicationCategoryIdSchema, 'params'),
  validate(updateMedicationCategorySchema),
  updateMedicationCategory
);

medicationCategoriesRouter.delete(
  '/:id',
  authorize(['medication-categories:delete']),
  validate(medicationCategoryIdSchema, 'params'),
  deleteMedicationCategory
);

export default medicationCategoriesRouter;
