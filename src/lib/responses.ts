import type { Response } from 'express';

interface SuccessResponse<T> {
  ok: true;
  message: string;
  data: T;
}

/**
 * Envía una respuesta exitosa estandarizada (200 OK por defecto).
 * @param res Objeto de respuesta de Express.
 * @param data Los datos a devolver.
 * @param message Mensaje opcional.
 * @param status Código HTTP (por defecto 200).
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  status: number = 200
): Response {
  const responseBody: SuccessResponse<T> = {
    ok: true,
    message,
    data
  };

  return res.status(status).json(responseBody);
}

/**
 * Envía una respuesta de recurso creado (201 Created).
 * @param res Objeto de respuesta de Express.
 * @param data Los datos a devolver.
 * @param message Mensaje opcional.
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response {
  return sendSuccess(res, data, message, 201);
}

/**
 * Envía una respuesta sin contenido para eliminaciones exitosas (204 No Content).
 * @param res Objeto de respuesta de Express.
 * @param message Mensaje opcional.
 */
export function sendNoContent(res: Response, message?: string): Response {
  if (message) {
    return res.status(200).json({ ok: true, message });
  }

  return res.status(204).send();
}

// Para respuestas con listas paginadas
export interface PaginatedResponse<T> {
  ok: true;
  message: string;
  data: T;
  total: number;
  page: number;
  limit: number;
}

export function sendPaginated<T>(
  res: Response,
  data: T,
  total: number,
  page: number,
  limit: number,
  message: string = 'Success'
): Response {
  const responseBody: PaginatedResponse<T> = {
    ok: true,
    message,
    data,
    total,
    page,
    limit
  };

  return res.status(200).json(responseBody);
}
