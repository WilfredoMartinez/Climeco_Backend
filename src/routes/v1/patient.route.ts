import { Router } from 'express';

import {
  createPatient,
  deletePatient,
  getAllPatients,
  updatePatient,
  getPatientById
} from '@/controllers/patient.controller';
import {
  assignAllergy,
  removeAllergy,
  getPatientAllergies
} from '@/controllers/patientAllergy.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  createPatientSchema,
  listPatientsSchema,
  patientIdSchema,
  updatePatientSchema
} from '@/schemas/patient.schema';
import {
  assignAllergySchema,
  removeAllergySchema,
  getPatientAllergiesSchema
} from '@/schemas/patientAllergy.schema';

const patientsRouter = Router();

patientsRouter.use(authenticate);

patientsRouter.get(
  '/',
  authorize(['patients:read']),
  validate(listPatientsSchema, 'query'),
  getAllPatients
);
patientsRouter.post(
  '/',
  authorize(['patients:create']),
  validate(createPatientSchema),
  createPatient
);
patientsRouter.get(
  '/:patientId',
  authorize(['patients:read']),
  validate(patientIdSchema, 'params'),
  getPatientById
);
patientsRouter.patch(
  '/:patientId',
  authorize(['patients:update']),
  validateMultiple({
    params: patientIdSchema,
    body: updatePatientSchema
  }),
  updatePatient
);
patientsRouter.delete(
  '/:patientId',
  authorize(['patients:delete']),
  validate(patientIdSchema, 'params'),
  deletePatient
);
patientsRouter.post(
  '/:patientId/allergies',
  authorize(['patients:assign-allergies']),
  validateMultiple({
    params: patientIdSchema,
    body: assignAllergySchema
  }),
  assignAllergy
);
patientsRouter.get(
  '/:patientId/allergies',
  authorize(['patients:read']),
  validate(getPatientAllergiesSchema, 'params'),
  getPatientAllergies
);
patientsRouter.delete(
  '/:patientId/allergies/:patientAllergyId',
  authorize(['patients:assign-allergies']),
  validate(removeAllergySchema, 'params'),
  removeAllergy
);

export default patientsRouter;
