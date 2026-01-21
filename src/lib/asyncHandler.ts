import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

/**
 * Wrapper para manejar promesas asíncronas en los controladores de Express.
 * Captura cualquier error de la promesa y lo pasa a next() para que el errorHandler lo maneje.
 */
export const asyncHandler =
  (fn: AsyncHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
