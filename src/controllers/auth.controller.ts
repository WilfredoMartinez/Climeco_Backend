import type { Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess } from '@/lib/responses';
import { loginUser, renewToken } from '@/services/auth.service';

export const loginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const loginResult = await loginUser({ username, password });

    sendSuccess(res, loginResult, `User ${username} logged in successfully.`);
  }
);

export const renewTokenController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.currentUser!.id;

    const { token } = await renewToken(userId);

    sendSuccess(res, token, 'Token renewed successfully.');
  }
);
