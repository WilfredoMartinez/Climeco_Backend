import { Router } from 'express';

import * as userController from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  changePasswordSchema,
  createUserSchema,
  getUsersQuerySchema,
  updateUserSchema,
  userIdSchema
} from '@/schemas/user.schema';

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get(
  '/',
  authorize(['users:read']),
  validate(getUsersQuerySchema, 'query'),
  userController.getUsers
);
userRouter.post(
  '/',
  authorize(['users:create']),
  validate(createUserSchema),
  userController.createUser
);
userRouter.get(
  '/:id',
  authorize(['users:read']),
  validate(userIdSchema, 'params'),
  userController.getUserById
);
userRouter.put(
  '/:id',
  authorize(['users:update']),
  validateMultiple({
    params: userIdSchema,
    body: updateUserSchema
  }),
  userController.updateUser
);
userRouter.patch(
  '/:id/change-password',
  authorize(['users:change-password']),
  validateMultiple({
    params: userIdSchema,
    body: changePasswordSchema
  }),
  userController.changePassword
);
userRouter.delete(
  '/:id',
  authorize(['users:delete']),
  validate(userIdSchema, 'params'),
  userController.deleteUser
);

export default userRouter;
