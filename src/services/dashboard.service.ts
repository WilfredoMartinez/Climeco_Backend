import { startOfDay, endOfDay, subDays } from 'date-fns';

import { prisma } from '@/lib/prisma';
import type { DashboardStatsDTO } from '@/types/dashboard.types';

export const getDashboardStats = async (): Promise<DashboardStatsDTO> => {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);
  const thirtyDaysAgo = subDays(today, 30);

  const [
    todayAppointments,
    lowStockMedicationsRaw,
    totalExamsCompleted,
    examRevenue,
    newPatientsCount
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday
        },
        isActive: true,
        status: {
          notIn: ['CANCELED', 'NO_SHOW']
        }
      }
    }),

    prisma.$queryRaw<
      Array<{ id: string; name: string; stock: number; minStock: number }>
    >`
      SELECT id, name, stock, min_stock as "minStock"
      FROM medications
      WHERE stock <= min_stock
        AND is_active = true
      ORDER BY stock ASC
      LIMIT 5
    `,

    prisma.exam.count({
      where: {
        status: {
          in: ['COMPLETED', 'DELIVERED']
        },
        isActive: true
      }
    }),

    prisma.exam
      .findMany({
        where: {
          status: {
            in: ['COMPLETED', 'DELIVERED']
          },
          isActive: true
        },
        include: {
          examType: {
            select: {
              price: true
            }
          }
        }
      })
      .then((exams) =>
        exams.reduce((total, exam) => total + exam.examType.price, 0)
      ),

    prisma.patient.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        },
        isActive: true
      }
    })
  ]);

  const lowStockMedications = lowStockMedicationsRaw.map(
    (med: { id: string; name: string; stock: number; minStock: number }) => ({
      id: med.id,
      name: med.name,
      stock: med.stock,
      minStock: med.minStock
    })
  );

  return {
    todayAppointments,
    lowStockMedications,
    totalExamsCompleted,
    totalExamRevenue: examRevenue,
    newPatientsCount
  };
};
