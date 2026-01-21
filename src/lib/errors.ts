import type { AppError } from '@/types/api';

/**
 * Genera un error 400 Bad Request.
 * @param message Mensaje de error para el cliente.
 */
export const createBadRequestError = (message: string): AppError => ({
  name: 'BadRequestError',
  status: 400,
  message
});

/**
 * Genera un error 404 Not Found.
 * @param message Mensaje de error para el cliente.
 */
export const createNotFoundError = (message: string): AppError => ({
  name: 'NotFoundError',
  status: 404,
  message
});

/**
 * Genera un error 401 Unauthorized.
 * @param message Mensaje de error para el cliente.
 */
export const createUnauthorizedError = (message: string): AppError => ({
  name: 'UnauthorizedError',
  status: 401,
  message
});

/**
 * Genera un error 403 Forbidden.
 * @param message Mensaje de error para el cliente.
 */
export const createForbiddenError = (message: string): AppError => ({
  name: 'ForbiddenError',
  status: 403,
  message
});

/**
 * Genera un error 409 Conflict.
 * @param message Mensaje de error para el cliente.
 */
export const createConflictError = (message: string): AppError => ({
  name: 'ConflictError',
  status: 409,
  message
});
