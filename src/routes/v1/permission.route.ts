import { Router } from 'express';

import { getPermissions } from '@/controllers/permission.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import { getPermissionsQuerySchema } from '@/schemas/permission.schema';

const permissionsRouter = Router();

permissionsRouter.use(authenticate);

permissionsRouter.get(
  '/',
  authorize(['roles:read', 'roles:assign-permissions']),
  validate(getPermissionsQuerySchema, 'query'),
  getPermissions
);

export default permissionsRouter;
