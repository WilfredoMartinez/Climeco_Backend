import type { PrismaTransactionClient } from '@/lib/prisma';
import * as activityLogRepository from '@/repositories/activityLog.repository';

export interface LogActivityParams {
  userId: string;
  action: string;
  oldValue?: Record<string, unknown> | string;
  newValue?: Record<string, unknown> | string;
  tx?: PrismaTransactionClient;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  const { userId, action, oldValue, newValue, tx } = params;

  const oldValueString =
    oldValue !== undefined
      ? typeof oldValue === 'string'
        ? oldValue
        : JSON.stringify(oldValue)
      : undefined;

  const newValueString =
    newValue !== undefined
      ? typeof newValue === 'string'
        ? newValue
        : JSON.stringify(newValue)
      : undefined;

  await activityLogRepository.create(
    {
      userId,
      action,
      oldValue: oldValueString,
      newValue: newValueString
    },
    tx
  );
}
