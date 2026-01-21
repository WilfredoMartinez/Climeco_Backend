import type { NextFunction, Request, Response } from 'express';
import type { ZodError, ZodObject, ZodRawShape, ZodType } from 'zod';

import { createBadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';

type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Middleware to validate request data using Zod schemas
 *
 * @param schema - Zod schema to validate against
 * @param target - The part of the request to validate ('body', 'params', or 'query')
 * @returns Express middleware function
 *
 * @example
 * // Validate request body
 * router.post('/users', validate(createUserSchema), createUser);
 *
 * @example
 * // Validate query parameters
 * router.get('/users', validate(querySchema, 'query'), getUsers);
 *
 * @example
 * // Validate route parameters
 * router.get('/users/:id', validate(idParamSchema, 'params'), getUserById);
 */
export const validate =
  (
    schema: ZodType | ZodObject<ZodRawShape>,
    target: ValidationTarget = 'body'
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req[target];

      const validatedData = schema.parse(dataToValidate);

      if (target !== 'query') {
        req[target] = validatedData;
      } else {
        // Para query, guardamos los datos validados en res.locals
        res.locals.validatedQuery = validatedData;
      }

      next();
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as ZodError;

        const errors = zodError.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));

        throw createBadRequestError(
          'Falló la validación: ' + JSON.stringify(errors)
        );
      }

      throw createBadRequestError('Falló la validación de los datos');
    }
  };

/**
 * Middleware to validate multiple parts of the request
 *
 * @param schemas - Object containing schemas for body, params, and/or query
 * @returns Express middleware function
 *
 * @example
 * router.post('/users/:id/posts',
 *   validateMultiple({
 *     params: idParamSchema,
 *     body: createPostSchema
 *   }),
 *   createPost
 * );
 */
export const validateMultiple =
  (schemas: {
    body?: ZodType | ZodObject<ZodRawShape>;
    params?: ZodType | ZodObject<ZodRawShape>;
    query?: ZodType | ZodObject<ZodRawShape>;
  }) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const errors: Array<{ field: string; message: string }> = [];

      for (const [target, schema] of Object.entries(schemas)) {
        if (schema) {
          try {
            const dataToValidate = req[target as ValidationTarget];
            const validatedData = schema.parse(dataToValidate);

            if (target !== 'query') {
              req[target as ValidationTarget] = validatedData;
            } else {
              // Para query, guardamos los datos validados en res.locals
              res.locals.validatedQuery = validatedData;
            }
          } catch (error) {
            if (error instanceof Error && 'issues' in error) {
              const zodError = error as ZodError;
              const targetErrors = zodError.issues.map((issue) => ({
                field: `${target}.${issue.path.join('.')}`,
                message: issue.message
              }));
              errors.push(...targetErrors);
            }
          }
        }
      }

      if (errors.length > 0) {
        logger.error('Validation errors: ', JSON.stringify(errors));

        throw createBadRequestError(
          'Falló la validación: ' + JSON.stringify(errors)
        );
      }

      next();
    } catch {
      throw createBadRequestError('Falló la validación de los datos');
    }
  };
