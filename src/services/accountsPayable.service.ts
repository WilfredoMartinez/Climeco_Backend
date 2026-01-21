import type z from 'zod';

import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as accountPayablePaymentRepository from '@/repositories/accountPayablePayment.repository';
import * as accountsPayableRepository from '@/repositories/accountsPayable.repository';
import * as patientRepository from '@/repositories/patient.repository';
import type {
  createAccountsPayableSchema,
  getAccountsPayableQuerySchema,
  updateAccountsPayableSchema
} from '@/schemas/accountsPayable.schema';
import { logActivity } from '@/services/activityLog.service';
import type { AccountsPayable } from '@/types/accountsPayable.types';

export async function createAccountsPayable(
  data: z.infer<typeof createAccountsPayableSchema>,
  userId: string
): Promise<AccountsPayable> {
  const patient = await patientRepository.findById(data.patientId);

  if (!patient) throw createNotFoundError('Paciente no encontrado');

  const accountsPayable = await accountsPayableRepository.create(data);

  await logActivity({
    userId,
    action: 'ACCOUNTS_PAYABLE:CREATE',
    newValue: {
      id: accountsPayable.id,
      patientId: accountsPayable.patientId,
      totalAmount: accountsPayable.totalAmount
    }
  });

  return accountsPayable;
}

export async function getAccountsPayableById(
  id: string
): Promise<AccountsPayable> {
  const accountsPayable = await accountsPayableRepository.findById(id);

  if (!accountsPayable)
    throw createNotFoundError('Cuenta por pagar no encontrada');

  return accountsPayable;
}

export async function getAllAccountsPayable(
  query: z.infer<typeof getAccountsPayableQuerySchema>
): Promise<{ accountsPayable: AccountsPayable[]; total: number }> {
  const { page, limit, patientId, status, term } = query;

  const filters = {
    patientId,
    status,
    term
  };

  const { data, total } = await accountsPayableRepository.findAll(
    filters,
    Number(page),
    Number(limit)
  );

  return {
    accountsPayable: data,
    total: Number(total)
  };
}

export async function updateAccountsPayable(
  id: string,
  data: z.infer<typeof updateAccountsPayableSchema>,
  userId: string
): Promise<AccountsPayable> {
  const accountsPayable = await accountsPayableRepository.findById(id);

  if (!accountsPayable)
    throw createNotFoundError('Cuenta por pagar no encontrada');

  const hasPayments =
    await accountsPayableRepository.countPaymentsByAccountId(id);

  if (hasPayments > 0 && data.totalAmount !== undefined) {
    throw createBadRequestError(
      'No se puede modificar el monto total de una cuenta que ya tiene pagos'
    );
  }

  if (hasPayments > 0 && data.numberOfInstallments !== undefined) {
    throw createBadRequestError(
      'No se puede modificar el número de cuotas de una cuenta que ya tiene pagos'
    );
  }

  const updatedAccountsPayable = await prisma.$transaction(async (tx) => {
    const updated = await accountsPayableRepository.update(id, data, tx);

    if (data.totalAmount !== undefined) {
      const remainingAmount = data.totalAmount - accountsPayable.paidAmount;
      await accountsPayableRepository.updateAmounts(
        id,
        accountsPayable.paidAmount,
        remainingAmount,
        accountsPayable.paidInstallments,
        tx
      );
    }

    return updated;
  });

  await logActivity({
    userId,
    action: 'ACCOUNTS_PAYABLE:UPDATE',
    oldValue: {
      id: accountsPayable.id,
      description: accountsPayable.description,
      totalAmount: accountsPayable.totalAmount,
      numberOfInstallments: accountsPayable.numberOfInstallments
    },
    newValue: {
      id: updatedAccountsPayable.id,
      description: updatedAccountsPayable.description,
      totalAmount: updatedAccountsPayable.totalAmount,
      numberOfInstallments: updatedAccountsPayable.numberOfInstallments
    }
  });

  return updatedAccountsPayable;
}

export async function deleteAccountsPayable(
  id: string,
  userId: string
): Promise<void> {
  const accountsPayable = await accountsPayableRepository.findById(id);

  if (!accountsPayable)
    throw createNotFoundError('Cuenta por pagar no encontrada');

  const hasPayments =
    await accountsPayableRepository.countPaymentsByAccountId(id);

  if (hasPayments > 0) {
    throw createBadRequestError(
      'No se puede eliminar una cuenta por pagar que ya tiene pagos registrados'
    );
  }

  await accountsPayableRepository.remove(id);

  await logActivity({
    userId,
    action: 'ACCOUNTS_PAYABLE:DELETE',
    oldValue: {
      id: accountsPayable.id,
      description: accountsPayable.description
    }
  });
}

export async function recalculateAccountAmounts(
  accountsPayableId: string
): Promise<void> {
  const accountsPayable =
    await accountsPayableRepository.findById(accountsPayableId);

  if (!accountsPayable)
    throw createNotFoundError('Cuenta por pagar no encontrada');

  const totalPaid =
    await accountPayablePaymentRepository.getTotalPaidByAccountId(
      accountsPayableId
    );

  const remainingAmount = accountsPayable.totalAmount - totalPaid;
  const installmentAmount =
    accountsPayable.totalAmount / accountsPayable.numberOfInstallments;
  const paidInstallments = totalPaid / installmentAmount;

  await accountsPayableRepository.updateAmounts(
    accountsPayableId,
    totalPaid,
    remainingAmount,
    paidInstallments
  );
}
