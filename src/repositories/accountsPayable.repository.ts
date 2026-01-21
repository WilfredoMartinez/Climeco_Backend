import type { Prisma } from '@prisma/client';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  AccountsPayable,
  CreateAccountsPayableDTO,
  UpdateAccountsPayableDTO
} from '@/types/accountsPayable.types';

export async function create(
  data: CreateAccountsPayableDTO,
  tx?: PrismaTransactionClient
): Promise<AccountsPayable> {
  const client = tx ?? prisma;

  const remainingAmount = data.totalAmount;

  const accountsPayable = await client.accountsPayable.create({
    data: {
      patientId: data.patientId,
      description: data.description,
      totalAmount: data.totalAmount,
      paidAmount: 0,
      remainingAmount,
      numberOfInstallments: data.numberOfInstallments,
      paidInstallments: 0,
      status: 'PENDING'
    },
    select: {
      id: true,
      patientId: true,
      description: true,
      totalAmount: true,
      paidAmount: true,
      remainingAmount: true,
      numberOfInstallments: true,
      paidInstallments: true,
      status: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      patient: {
        select: {
          firstName: true,
          lastName: true,
          medicalRecordNumber: true
        }
      }
    }
  });

  return accountsPayable;
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<AccountsPayable | null> {
  const client = tx ?? prisma;

  const accountsPayable = await client.accountsPayable.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      patientId: true,
      description: true,
      totalAmount: true,
      paidAmount: true,
      remainingAmount: true,
      numberOfInstallments: true,
      paidInstallments: true,
      status: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      patient: {
        select: {
          firstName: true,
          lastName: true,
          medicalRecordNumber: true
        }
      }
    }
  });

  return accountsPayable;
}

export async function findAll(
  filters: {
    term: string | undefined;
    patientId: string | undefined;
    status: 'PENDING' | 'PAID' | 'CANCELLED' | undefined;
  },
  page: number,
  limit: number,
  tx?: PrismaTransactionClient
): Promise<{ data: AccountsPayable[]; total: number }> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where: Prisma.AccountsPayableWhereInput = {
    isActive: true,
    deletedAt: null
  };

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.term) {
    where.OR = [
      { description: { contains: filters.term, mode: 'insensitive' } },
      {
        patient: {
          OR: [
            { firstName: { contains: filters.term, mode: 'insensitive' } },
            { lastName: { contains: filters.term, mode: 'insensitive' } }
          ]
        }
      }
    ];
  }

  const [data, total] = await Promise.all([
    client.accountsPayable.findMany({
      where,
      select: {
        id: true,
        patientId: true,
        description: true,
        totalAmount: true,
        paidAmount: true,
        remainingAmount: true,
        numberOfInstallments: true,
        paidInstallments: true,
        status: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        patient: {
          select: {
            firstName: true,
            lastName: true,
            medicalRecordNumber: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    client.accountsPayable.count({ where })
  ]);

  return { data, total };
}

export async function update(
  id: string,
  data: UpdateAccountsPayableDTO,
  tx?: PrismaTransactionClient
): Promise<AccountsPayable> {
  const client = tx ?? prisma;

  const updateData: Prisma.AccountsPayableUpdateInput = {};

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.totalAmount !== undefined) {
    updateData.totalAmount = data.totalAmount;
  }

  if (data.numberOfInstallments !== undefined) {
    updateData.numberOfInstallments = data.numberOfInstallments;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  const accountsPayable = await client.accountsPayable.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      patientId: true,
      description: true,
      totalAmount: true,
      paidAmount: true,
      remainingAmount: true,
      numberOfInstallments: true,
      paidInstallments: true,
      status: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      patient: {
        select: {
          firstName: true,
          lastName: true,
          medicalRecordNumber: true
        }
      }
    }
  });

  return accountsPayable;
}

export async function remove(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.accountsPayable.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}

export async function countPaymentsByAccountId(
  accountsPayableId: string,
  tx?: PrismaTransactionClient
): Promise<number> {
  const client = tx ?? prisma;

  return client.accountPayablePayment.count({
    where: {
      accountsPayableId,
      isActive: true,
      deletedAt: null
    }
  });
}

export async function updateAmounts(
  id: string,
  paidAmount: number,
  remainingAmount: number,
  paidInstallments: number,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.accountsPayable.update({
    where: { id },
    data: {
      paidAmount,
      remainingAmount,
      paidInstallments,
      status: remainingAmount <= 0 ? 'PAID' : 'PENDING'
    }
  });
}
