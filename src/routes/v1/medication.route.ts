import { Router } from 'express';

import {
  createMedication,
  getMedications,
  getMedicationById,
  updateMedication,
  deleteMedication
} from '@/controllers/medication.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  createMedicationSchema,
  getMedicationsQuerySchema,
  medicationIdSchema,
  updateMedicationSchema
} from '@/schemas/medication.schema';

const medicationsRouter = Router();

// Todas las rutas requieren autenticación
medicationsRouter.use(authenticate);

// GET /api/v1/medications - Listar medicamentos
medicationsRouter.get(
  '/',
  authorize(['medications:read']),
  validate(getMedicationsQuerySchema, 'query'),
  getMedications
);

// POST /api/v1/medications - Crear medicamento
medicationsRouter.post(
  '/',
  authorize(['medications:create']),
  validate(createMedicationSchema),
  createMedication
);

// GET /api/v1/medications/:id - Obtener medicamento por ID
medicationsRouter.get(
  '/:id',
  authorize(['medications:read']),
  validate(medicationIdSchema, 'params'),
  getMedicationById
);

// PATCH /api/v1/medications/:id - Actualizar medicamento
medicationsRouter.patch(
  '/:id',
  authorize(['medications:update']),
  validateMultiple({
    params: medicationIdSchema,
    body: updateMedicationSchema
  }),
  updateMedication
);

// DELETE /api/v1/medications/:id - Eliminar medicamento
medicationsRouter.delete(
  '/:id',
  authorize(['medications:delete']),
  validate(medicationIdSchema, 'params'),
  deleteMedication
);

export default medicationsRouter;
