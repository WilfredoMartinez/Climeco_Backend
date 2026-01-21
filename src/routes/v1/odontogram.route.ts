import { Router } from 'express';

import * as odontogramController from '@/controllers/odontogram.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// POST /api/v1/odontograms - Crear odontograma
router.post(
  '/',
  authorize(['CREATE_DENTAL_HISTORY']),
  odontogramController.createOdontogram
);

// GET /api/v1/odontograms/dental-history/:dentalHistoryId - Obtener odontograma por historial dental
router.get(
  '/dental-history/:dentalHistoryId',
  authorize(['VIEW_DENTAL_HISTORY']),
  odontogramController.getOdontogramByDentalHistoryId
);

// GET /api/v1/odontograms/:id - Obtener odontograma por ID
router.get(
  '/:id',
  authorize(['VIEW_DENTAL_HISTORY']),
  odontogramController.getOdontogramById
);

// PUT /api/v1/odontograms/:id - Actualizar odontograma completo
router.put(
  '/:id',
  authorize(['UPDATE_DENTAL_HISTORY']),
  odontogramController.updateOdontogram
);

// PATCH /api/v1/odontograms/:id/teeth/:toothId - Actualizar un diente específico
router.patch(
  '/:id/teeth/:toothId',
  authorize(['UPDATE_DENTAL_HISTORY']),
  odontogramController.updateTooth
);

// DELETE /api/v1/odontograms/:id - Eliminar odontograma
router.delete(
  '/:id',
  authorize(['DELETE_DENTAL_HISTORY']),
  odontogramController.deleteOdontogram
);

export default router;
