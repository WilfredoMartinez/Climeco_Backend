import { Router } from 'express';

import * as dashboardController from '@/controllers/dashboard.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';

const router = Router();

router.use(authenticate);

router.get(
  '/stats',
  authorize(['dashboard:read']),
  dashboardController.getDashboardStats
);

export default router;
