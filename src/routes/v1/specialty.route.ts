import { Router } from 'express';

import {
  createSpecialty,
  deleteSpecialty,
  getSpecialties,
  getSpecialtyById,
  updateSpecialty
} from '@/controllers/specialty.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  createSpecialtySchema,
  getSpecialtiesQuerySchema,
  specialtyIdSchema,
  updateSpecialtySchema
} from '@/schemas/specialty.schema';

const specialtiesRouter = Router();

specialtiesRouter.use(authenticate);

specialtiesRouter.get(
  '/',
  authorize(['specialties:read']),
  validate(getSpecialtiesQuerySchema, 'query'),
  getSpecialties
);
specialtiesRouter.post(
  '/',
  authorize(['specialties:create']),
  validate(createSpecialtySchema),
  createSpecialty
);
specialtiesRouter.get(
  '/:id',
  authorize(['specialties:read']),
  validate(specialtyIdSchema, 'params'),
  getSpecialtyById
);
specialtiesRouter.put(
  '/:id',
  authorize(['specialties:update']),
  validateMultiple({
    params: specialtyIdSchema,
    body: updateSpecialtySchema
  }),
  updateSpecialty
);
specialtiesRouter.delete(
  '/:id',
  authorize(['specialties:delete']),
  validate(specialtyIdSchema, 'params'),
  deleteSpecialty
);

export default specialtiesRouter;
