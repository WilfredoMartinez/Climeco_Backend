import type { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response): Response {
  return res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    ok: false
  });
}
