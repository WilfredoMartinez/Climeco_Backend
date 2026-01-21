import { Router } from 'express';

import {
  createPayment,
  getPaymentById,
  getPayments,
  updatePayment
} from '@/controllers/accountPayablePayment.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  createPaymentSchema,
  getPaymentsQuerySchema,
  paymentIdSchema,
  updatePaymentSchema
} from '@/schemas/accountPayablePayment.schema';

const accountPayablePaymentRouter = Router();

accountPayablePaymentRouter.use(authenticate);

accountPayablePaymentRouter.get(
  '/',
  authorize(['payments:read']),
  validate(getPaymentsQuerySchema, 'query'),
  getPayments
);

accountPayablePaymentRouter.post(
  '/',
  authorize(['payments:create']),
  validate(createPaymentSchema),
  createPayment
);

accountPayablePaymentRouter.get(
  '/:id',
  authorize(['payments:read']),
  validate(paymentIdSchema, 'params'),
  getPaymentById
);

accountPayablePaymentRouter.put(
  '/:id',
  authorize(['payments:update']),
  validateMultiple({
    params: paymentIdSchema,
    body: updatePaymentSchema
  }),
  updatePayment
);

export default accountPayablePaymentRouter;
