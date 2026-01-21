import type { Request, Response } from 'express';
import type z from 'zod';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendCreated, sendPaginated, sendSuccess } from '@/lib/responses';
import type {
  createPaymentSchema,
  getPaymentsQuerySchema,
  paymentIdSchema,
  updatePaymentSchema
} from '@/schemas/accountPayablePayment.schema';
import * as accountPayablePaymentService from '@/services/accountPayablePayment.service';

export const createPayment = asyncHandler(
  async (
    req: Request<unknown, unknown, z.infer<typeof createPaymentSchema>>,
    res: Response
  ): Promise<void> => {
    const userId = req.currentUser!.id;

    const payment = await accountPayablePaymentService.createPayment(
      req.body,
      userId
    );

    sendCreated(res, payment, 'Pago creado exitosamente');
  }
);

export const getPayments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, accountsPayableId } = req.query as unknown as z.infer<
      typeof getPaymentsQuerySchema
    >;

    const { payments, total } =
      await accountPayablePaymentService.getAllPayments({
        page: parseInt(String(page), 10),
        limit: parseInt(String(limit), 10),
        accountsPayableId
      });

    sendPaginated(
      res,
      payments,
      total,
      page,
      limit,
      'Pagos obtenidos exitosamente'
    );
  }
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof paymentIdSchema>;

    const payment = await accountPayablePaymentService.getPaymentById(id);

    sendSuccess(res, payment, 'Pago obtenido exitosamente');
  }
);

export const updatePayment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as z.infer<typeof paymentIdSchema>;
    const userId = req.currentUser!.id;

    const payment = await accountPayablePaymentService.updatePayment(
      id,
      req.body as z.infer<typeof updatePaymentSchema>,
      userId
    );

    sendSuccess(res, payment, 'Pago actualizado exitosamente');
  }
);
