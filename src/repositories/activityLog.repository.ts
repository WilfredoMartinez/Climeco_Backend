import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  ActivityLog,
  CreateActivityLogDTO
} from '@/types/activityLog.types';

export async function create(
  data: CreateActivityLogDTO,
  tx?: PrismaTransactionClient
): Promise<ActivityLog> {
  const client = tx ?? prisma;

  const log = await client.activityLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      oldValue: data.oldValue ?? null,
      newValue: data.newValue ?? null
    },
    select: {
      id: true,
      userId: true,
      action: true,
      oldValue: true,
      newValue: true,
      timestamp: true,
      createdAt: true
    }
  });

  return {
    id: log.id,
    userId: log.userId,
    action: log.action,
    oldValue: log.oldValue ?? undefined,
    newValue: log.newValue ?? undefined,
    timestamp: log.timestamp,
    createdAt: log.createdAt
  };
}

export async function findByUserId(
  userId: string,
  page: number = 1,
  limit: number = 50,
  tx?: PrismaTransactionClient
): Promise<{ logs: ActivityLog[]; total: number }> {
  const client = tx ?? prisma;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    client.activityLog.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        action: true,
        oldValue: true,
        newValue: true,
        timestamp: true,
        createdAt: true
      },
      skip,
      take: limit,
      orderBy: {
        timestamp: 'desc'
      }
    }),
    client.activityLog.count({ where: { userId } })
  ]);

  return {
    logs: logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      action: log.action,
      oldValue: log.oldValue ?? undefined,
      newValue: log.newValue ?? undefined,
      timestamp: log.timestamp,
      createdAt: log.createdAt
    })),
    total
  };
}

export async function findAll(
  page: number = 1,
  limit: number = 50,
  tx?: PrismaTransactionClient
): Promise<{ logs: ActivityLog[]; total: number }> {
  const client = tx ?? prisma;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    client.activityLog.findMany({
      select: {
        id: true,
        userId: true,
        action: true,
        oldValue: true,
        newValue: true,
        timestamp: true,
        createdAt: true
      },
      skip,
      take: limit,
      orderBy: {
        timestamp: 'desc'
      }
    }),
    client.activityLog.count()
  ]);

  return {
    logs: logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      action: log.action,
      oldValue: log.oldValue ?? undefined,
      newValue: log.newValue ?? undefined,
      timestamp: log.timestamp,
      createdAt: log.createdAt
    })),
    total
  };
}
