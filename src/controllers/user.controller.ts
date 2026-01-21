import type { Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendCreated,
  sendNoContent,
  sendPaginated,
  sendSuccess
} from '@/lib/responses';
import * as userService from '@/services/user.service';
import type {
  ChangePasswordInput,
  CreateUserInput,
  GetUsersQuery,
  UpdateUserInput
} from '@/types/user.types';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = (res.locals.validatedQuery || req.query) as GetUsersQuery;

  const result = await userService.getUsers(query);

  sendPaginated(
    res,
    result.users,
    result.pagination.total,
    result.pagination.page,
    result.pagination.limit
  );
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  sendSuccess(res, user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as CreateUserInput;
  const currentUserId = req.currentUser!.id;

  const user = await userService.createUser(data, currentUserId);

  sendCreated(res, user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as UpdateUserInput;
  const currentUserId = req.currentUser!.id;

  const user = await userService.updateUser(id, data, currentUserId);

  sendSuccess(res, user);
});

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as ChangePasswordInput;
    const currentUserId = req.currentUser!.id;

    await userService.changePassword(id, data, currentUserId);

    sendNoContent(res);
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.currentUser!.id;

  await userService.deleteUser(id, currentUserId);

  sendNoContent(res);
});
