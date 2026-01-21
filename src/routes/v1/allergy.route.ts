import { Router } from 'express';

import {
  createAllergy,
  deleteAllergy,
  getAllergies,
  getAllergyById,
  updateAllergy
} from '@/controllers/allergy.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  allergyIdSchema,
  createAllergySchema,
  getAllergiesQuerySchema,
  updateAllergySchema
} from '@/schemas/allergy.schema';

const allergiesRouter = Router();

allergiesRouter.use(authenticate);

allergiesRouter.get(
  '/',
  authorize(['allergies:read']),
  validate(getAllergiesQuerySchema, 'query'),
  getAllergies
);
allergiesRouter.post(
  '/',
  authorize(['allergies:create']),
  validate(createAllergySchema),
  createAllergy
);
allergiesRouter.get(
  '/:id',
  authorize(['allergies:read']),
  validate(allergyIdSchema, 'params'),
  getAllergyById
);
allergiesRouter.put(
  '/:id',
  authorize(['allergies:update']),
  validateMultiple({
    params: allergyIdSchema,
    body: updateAllergySchema
  }),
  updateAllergy
);
allergiesRouter.delete(
  '/:id',
  authorize(['allergies:delete']),
  validate(allergyIdSchema, 'params'),
  deleteAllergy
);

export default allergiesRouter;
