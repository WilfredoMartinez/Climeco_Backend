import type { Prisma } from '@prisma/client';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  AccountPayablePayment,
  CreatePaymentDTO,
  UpdatePaymentDTO
} from '@/types/accountPayablePayment.types';

export async function create(
  data: CreatePaymentDTO,
  tx?: PrismaTransactionClient
): Promise<AccountPayablePayment> {
  const client = tx ?? prisma;

  const payment = await client.accountPayablePayment.create({
    data: {
      accountsPayableId: data.accountsPayableId,
      amount: data.amount,
      installmentNumber: data.installmentNumber ?? null,
      isPartial: data.isPartial,
      paymentDate: data.paymentDate ?? new Date(),
      notes: data.notes ?? null
    },
    select: {
      id: true,
      accountsPayableId: true,
      amount: true,
      installmentNumber: true,
      isPartial: true,
      paymentDate: true,
      notes: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true
    }
  });

  return payment;
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<AccountPayablePayment | null> {
  const client = tx ?? prisma;

  const payment = await client.accountPayablePayment.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      accountsPayableId: true,
      amount: true,
      installmentNumber: true,
      isPartial: true,
      paymentDate: true,
      notes: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true
    }
  });

  return payment;
}

export async function findAll(
  filters: { accountsPayableId: string | undefined },
  page: number,
  limit: number,
  tx?: PrismaTransactionClient
): Promise<{ data: AccountPayablePayment[]; total: number }> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where: Prisma.AccountPayablePaymentWhereInput = {
    isActive: true,
    deletedAt: null
  };

  if (filters.accountsPayableId) {
    where.accountsPayableId = filters.accountsPayableId;
  }

  const [data, total] = await Promise.all([
    client.accountPayablePayment.findMany({
      where,
      select: {
        id: true,
        accountsPayableId: true,
        amount: true,
        installmentNumber: true,
        isPartial: true,
        paymentDate: true,
        notes: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
      },
      skip,
      take: limit,
      orderBy: { paymentDate: 'desc' }
    }),
    client.accountPayablePayment.count({ where })
  ]);

  return { data, total };
}

export async function update(
  id: string,
  data: UpdatePaymentDTO,
  tx?: PrismaTransactionClient
): Promise<AccountPayablePayment> {
  const client = tx ?? prisma;

  const updateData: Prisma.AccountPayablePaymentUpdateInput = {};

  if (data.amount !== undefined) {
    updateData.amount = data.amount;
  }

  if (data.installmentNumber !== undefined) {
    updateData.installmentNumber = data.installmentNumber;
  }

  if (data.isPartial !== undefined) {
    updateData.isPartial = data.isPartial;
  }

  if (data.paymentDate !== undefined) {
    updateData.paymentDate = data.paymentDate;
  }

  if (data.notes !== undefined) {
    updateData.notes = data.notes;
  }

  const payment = await client.accountPayablePayment.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      accountsPayableId: true,
      amount: true,
      installmentNumber: true,
      isPartial: true,
      paymentDate: true,
      notes: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true
    }
  });

  return payment;
}

export async function getTotalPaidByAccountId(
  accountsPayableId: string,
  tx?: PrismaTransactionClient
): Promise<number> {
  const client = tx ?? prisma;

  const result = await client.accountPayablePayment.aggregate({
    where: {
      accountsPayableId,
      isActive: true,
      deletedAt: null
    },
    _sum: {
      amount: true
    }
  });

  return result._sum.amount ?? 0;
}

export async function calculatePaidInstallments(
  accountsPayableId: string,
  installmentAmount: number,
  tx?: PrismaTransactionClient
): Promise<number> {
  const client = tx ?? prisma;

  const totalPaid = await getTotalPaidByAccountId(accountsPayableId, client);

  return totalPaid / installmentAmount;
}
