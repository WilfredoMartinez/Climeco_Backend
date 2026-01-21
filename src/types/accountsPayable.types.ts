import type { z } from 'zod';

import type {
  createAccountsPayableSchema,
  getAccountsPayableQuerySchema,
  updateAccountsPayableSchema
} from '@/schemas/accountsPayable.schema';

export type AccountPayableStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface AccountsPayable {
  id: string;
  patientId: string;
  description: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  numberOfInstallments: number;
  paidInstallments: number;
  status: AccountPayableStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  patient: {
    firstName: string;
    lastName: string;
    medicalRecordNumber: string;
  };
}

export type CreateAccountsPayableDTO = z.infer<
  typeof createAccountsPayableSchema
>;
export type UpdateAccountsPayableDTO = z.infer<
  typeof updateAccountsPayableSchema
>;
export type GetAccountsPayableQueryDTO = z.infer<
  typeof getAccountsPayableQuerySchema
>;
