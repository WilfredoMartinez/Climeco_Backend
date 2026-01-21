import type z from 'zod';

import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as accountPayablePaymentRepository from '@/repositories/accountPayablePayment.repository';
import * as accountsPayableRepository from '@/repositories/accountsPayable.repository';
import type {
  createPaymentSchema,
  getPaymentsQuerySchema,
  updatePaymentSchema
} from '@/schemas/accountPayablePayment.schema';
import { recalculateAccountAmounts } from '@/services/accountsPayable.service';
import { logActivity } from '@/services/activityLog.service';
import type { AccountPayablePayment } from '@/types/accountPayablePayment.types';

export async function createPayment(
  data: z.infer<typeof createPaymentSchema>,
  userId: string
): Promise<AccountPayablePayment> {
  const accountsPayable = await accountsPayableRepository.findById(
    data.accountsPayableId
  );

  if (!accountsPayable)
    throw createNotFoundError('Cuenta por pagar no encontrada');

  if (accountsPayable.status === 'PAID') {
    throw createBadRequestError('La cuenta por pagar ya está pagada');
  }

  if (accountsPayable.status === 'CANCELLED') {
    throw createBadRequestError('La cuenta por pagar está cancelada');
  }

  if (data.amount > accountsPayable.remainingAmount) {
    throw createBadRequestError(
      'El monto del pago excede el monto restante de la cuenta'
    );
  }

  const payment = await prisma.$transaction(async (tx) => {
    const newPayment = await accountPayablePaymentRepository.create(data, tx);

    const totalPaid =
      await accountPayablePaymentRepository.getTotalPaidByAccountId(
        data.accountsPayableId,
        tx
      );
    const remainingAmount = accountsPayable.totalAmount - totalPaid;
    const installmentAmount =
      accountsPayable.totalAmount / accountsPayable.numberOfInstallments;
    const paidInstallments = totalPaid / installmentAmount;

    await accountsPayableRepository.updateAmounts(
      data.accountsPayableId,
      totalPaid,
      remainingAmount,
      paidInstallments,
      tx
    );

    return newPayment;
  });

  await logActivity({
    userId,
    action: 'PAYMENT:CREATE',
    newValue: {
      id: payment.id,
      accountsPayableId: payment.accountsPayableId,
      amount: payment.amount
    }
  });

  return payment;
}

export async function getPaymentById(
  id: string
): Promise<AccountPayablePayment> {
  const payment = await accountPayablePaymentRepository.findById(id);

  if (!payment) throw createNotFoundError('Pago no encontrado');

  return payment;
}

export async function getAllPayments(
  query: z.infer<typeof getPaymentsQuerySchema>
): Promise<{ payments: AccountPayablePayment[]; total: number }> {
  const { page, limit, accountsPayableId } = query;

  const filters = {
    accountsPayableId
  };

  const { data, total } = await accountPayablePaymentRepository.findAll(
    filters,
    Number(page),
    Number(limit)
  );

  return {
    payments: data,
    total: Number(total)
  };
}

export async function updatePayment(
  id: string,
  data: z.infer<typeof updatePaymentSchema>,
  userId: string
): Promise<AccountPayablePayment> {
  const payment = await accountPayablePaymentRepository.findById(id);

  if (!payment) throw createNotFoundError('Pago no encontrado');

  const accountsPayable = await accountsPayableRepository.findById(
    payment.accountsPayableId
  );

  if (!accountsPayable)
    throw createNotFoundError('Cuenta por pagar no encontrada');

  if (data.amount !== undefined) {
    const otherPaymentsTotal =
      (await accountPayablePaymentRepository.getTotalPaidByAccountId(
        payment.accountsPayableId
      )) - payment.amount;

    const newTotal = otherPaymentsTotal + data.amount;

    if (newTotal > accountsPayable.totalAmount) {
      throw createBadRequestError(
        'El nuevo monto excedería el total de la cuenta por pagar'
      );
    }
  }

  const updatedPayment = await prisma.$transaction(async (tx) => {
    const updated = await accountPayablePaymentRepository.update(id, data, tx);

    await recalculateAccountAmounts(payment.accountsPayableId);

    return updated;
  });

  await logActivity({
    userId,
    action: 'PAYMENT:UPDATE',
    oldValue: {
      id: payment.id,
      amount: payment.amount
    },
    newValue: {
      id: updatedPayment.id,
      amount: updatedPayment.amount
    }
  });

  return updatedPayment;
}
