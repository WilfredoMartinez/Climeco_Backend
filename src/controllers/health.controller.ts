import type { Request, Response } from 'express';

import { sendSuccess } from '@/lib/responses';

export const healthCheck = (_req: Request, res: Response): Response => {
  return sendSuccess(res, null, 'Server is healthy', 200);
};
