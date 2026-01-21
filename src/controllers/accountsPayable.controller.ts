import type { Request, Response } from 'express';
import type z from 'zod';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendCreated,
  sendNoContent,
  sendPaginated,
  sendSuccess
} from '@/lib/responses';
import type {
  accountsPayableIdSchema,
  createAccountsPayableSchema,
  getAccountsPayableQuerySchema,
  updateAccountsPayableSchema
} from '@/schemas/accountsPayable.schema';
import * as accountsPayableService from '@/services/accountsPayable.service';

export const createAccountsPayable = asyncHandler(
  async (
    req: Request<unknown, unknown, z.infer<typeof createAccountsPayableSchema>>,
    res: Response
  ): Promise<void> => {
    const userId = req.currentUser!.id;

    const accountsPayable = await accountsPayableService.createAccountsPayable(
      req.body,
      userId
    );

    sendCreated(res, accountsPayable, 'Cuenta por pagar creada exitosamente');
  }
);

export const getAccountsPayable = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, patientId, status, term } =
      req.query as unknown as z.infer<typeof getAccountsPayableQuerySchema>;

    const { accountsPayable, total } =
      await accountsPayableService.getAllAccountsPayable({
        page: parseInt(String(page), 10),
        limit: parseInt(String(limit), 10),
        patientId,
        status,
        term
      });

    sendPaginated(
      res,
      accountsPayable,
      total,
      page,
      limit,
      'Cuentas por pagar obtenidas exitosamente'
    );
  }
);

export const getAccountsPayableById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof accountsPayableIdSchema>;

    const accountsPayable =
      await accountsPayableService.getAccountsPayableById(id);

    sendSuccess(res, accountsPayable, 'Cuenta por pagar obtenida exitosamente');
  }
);

export const updateAccountsPayable = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof accountsPayableIdSchema>;
    const userId = req.currentUser!.id;

    const accountsPayable = await accountsPayableService.updateAccountsPayable(
      id,
      req.body as z.infer<typeof updateAccountsPayableSchema>,
      userId
    );

    sendSuccess(
      res,
      accountsPayable,
      'Cuenta por pagar actualizada exitosamente'
    );
  }
);

export const deleteAccountsPayable = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof accountsPayableIdSchema>;
    const userId = req.currentUser!.id;

    await accountsPayableService.deleteAccountsPayable(id, userId);

    sendNoContent(res);
  }
);
