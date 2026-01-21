import { Router } from 'express';

import {
  createAccountsPayable,
  deleteAccountsPayable,
  getAccountsPayable,
  getAccountsPayableById,
  updateAccountsPayable
} from '@/controllers/accountsPayable.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  accountsPayableIdSchema,
  createAccountsPayableSchema,
  getAccountsPayableQuerySchema,
  updateAccountsPayableSchema
} from '@/schemas/accountsPayable.schema';

const accountsPayableRouter = Router();

accountsPayableRouter.use(authenticate);

accountsPayableRouter.get(
  '/',
  authorize(['accounts-payable:read']),
  validate(getAccountsPayableQuerySchema, 'query'),
  getAccountsPayable
);

accountsPayableRouter.post(
  '/',
  authorize(['accounts-payable:create']),
  validate(createAccountsPayableSchema),
  createAccountsPayable
);

accountsPayableRouter.get(
  '/:id',
  authorize(['accounts-payable:read']),
  validate(accountsPayableIdSchema, 'params'),
  getAccountsPayableById
);

accountsPayableRouter.put(
  '/:id',
  authorize(['accounts-payable:update']),
  validateMultiple({
    params: accountsPayableIdSchema,
    body: updateAccountsPayableSchema
  }),
  updateAccountsPayable
);

accountsPayableRouter.delete(
  '/:id',
  authorize(['accounts-payable:delete']),
  validate(accountsPayableIdSchema, 'params'),
  deleteAccountsPayable
);

export default accountsPayableRouter;
