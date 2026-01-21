import { Router } from 'express';

import * as reportController from '@/controllers/report.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  appointmentsReportSchema,
  paymentsReportSchema,
  accountsReceivableReportSchema,
  patientsReportSchema,
  examsReportSchema,
  surveysReportSchema
} from '@/schemas/report.schema';

const router = Router();

router.use(authenticate);

router.get(
  '/appointments',
  authorize(['reports:read']),
  validate(appointmentsReportSchema, 'query'),
  reportController.getAppointmentsReport
);

router.get(
  '/payments',
  authorize(['reports:read']),
  validate(paymentsReportSchema, 'query'),
  reportController.getPaymentsSummaryReport
);

router.get(
  '/accounts-receivable',
  authorize(['reports:read']),
  validate(accountsReceivableReportSchema, 'query'),
  reportController.getAccountsReceivableReport
);

router.get(
  '/patients',
  authorize(['reports:read']),
  validate(patientsReportSchema, 'query'),
  reportController.getPatientsReport
);

router.get(
  '/exams',
  authorize(['reports:read']),
  validate(examsReportSchema, 'query'),
  reportController.getExamsReport
);

router.get(
  '/surveys',
  authorize(['reports:read']),
  validate(surveysReportSchema, 'query'),
  reportController.getSurveysReport
);

export default router;
