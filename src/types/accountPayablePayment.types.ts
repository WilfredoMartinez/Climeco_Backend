import type { z } from 'zod';

import type {
  createPaymentSchema,
  updatePaymentSchema,
  getPaymentsQuerySchema
} from '@/schemas/accountPayablePayment.schema';

export interface AccountPayablePayment {
  id: string;
  accountsPayableId: string;
  amount: number;
  installmentNumber?: number | null;
  isPartial: boolean;
  paymentDate: Date;
  notes?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentDTO = z.infer<typeof updatePaymentSchema>;
export type GetPaymentsQueryDTO = z.infer<typeof getPaymentsQuerySchema>;
