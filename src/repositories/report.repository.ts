import type { Prisma } from '@prisma/client';
import { differenceInDays, format } from 'date-fns';

import { prisma } from '@/lib/prisma';
import type {
  AppointmentsReportDTO,
  PaymentsReportDTO,
  PatientsReportDTO,
  ExamsReportDTO,
  SurveysReportDTO,
  AppointmentsAverageReport,
  AppointmentsByStatusReport,
  AppointmentsByDoctorReport,
  PaymentsSummaryReport,
  AccountsReceivableReport,
  PatientsReport,
  ExamsReport,
  SurveysReport
} from '@/types/report.types';

export async function getAppointmentsReport(
  filters: AppointmentsReportDTO
): Promise<AppointmentsAverageReport> {
  const where: Prisma.AppointmentWhereInput = {
    isActive: true,
    deletedAt: null,
    date: {
      gte: filters.startDate,
      lte: filters.endDate
    }
  };

  if (filters.doctorId) {
    where.userId = filters.doctorId;
  }

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  const appointments = await prisma.appointment.findMany({
    where,
    select: {
      id: true,
      status: true,
      duration: true,
      userId: true,
      user: {
        select: {
          id: true,
          fullName: true
        }
      }
    }
  });

  const totalAppointments = appointments.length;
  const totalDays = differenceInDays(filters.endDate, filters.startDate) + 1;
  const averagePerDay = totalAppointments / totalDays;

  // Agrupar por estado
  const statusCount: Record<string, number> = {};
  appointments.forEach((apt) => {
    statusCount[apt.status] = (statusCount[apt.status] || 0) + 1;
  });

  const byStatus: AppointmentsByStatusReport[] = Object.entries(
    statusCount
  ).map(([status, count]) => ({
    status,
    count,
    percentage: (count / totalAppointments) * 100
  }));

  // Agrupar por doctor
  const doctorStats: Record<
    string,
    {
      name: string;
      total: number;
      completed: number;
      canceled: number;
      noShow: number;
      totalDuration: number;
    }
  > = {};

  appointments.forEach((apt) => {
    if (!doctorStats[apt.userId]) {
      doctorStats[apt.userId] = {
        name: apt.user.fullName,
        total: 0,
        completed: 0,
        canceled: 0,
        noShow: 0,
        totalDuration: 0
      };
    }

    doctorStats[apt.userId].total += 1;
    doctorStats[apt.userId].totalDuration += apt.duration;

    if (apt.status === 'COMPLETED') {
      doctorStats[apt.userId].completed += 1;
    } else if (apt.status === 'CANCELED') {
      doctorStats[apt.userId].canceled += 1;
    } else if (apt.status === 'NO_SHOW') {
      doctorStats[apt.userId].noShow += 1;
    }
  });

  const byDoctor: AppointmentsByDoctorReport[] = Object.entries(
    doctorStats
  ).map(([doctorId, stats]) => ({
    doctorId,
    doctorName: stats.name,
    totalAppointments: stats.total,
    completedAppointments: stats.completed,
    canceledAppointments: stats.canceled,
    noShowAppointments: stats.noShow,
    averageDuration: stats.total > 0 ? stats.totalDuration / stats.total : 0
  }));

  return {
    totalAppointments,
    totalDays,
    averagePerDay: Math.round(averagePerDay * 100) / 100,
    byStatus,
    byDoctor
  };
}

export async function getPaymentsSummaryReport(
  filters: PaymentsReportDTO
): Promise<PaymentsSummaryReport> {
  const where: Prisma.AccountsPayableWhereInput = {
    isActive: true,
    createdAt: {
      gte: filters.startDate,
      lte: filters.endDate
    }
  };

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  const accounts = await prisma.accountsPayable.findMany({
    where,
    select: {
      id: true,
      totalAmount: true,
      paidAmount: true,
      remainingAmount: true,
      status: true,
      payments: {
        where: {
          isActive: true,
          paymentDate: {
            gte: filters.startDate,
            lte: filters.endDate
          }
        },
        select: {
          amount: true,
          paymentDate: true
        }
      }
    }
  });

  const totalAccounts = accounts.length;
  let totalAmount = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let totalCancelled = 0;
  let accountsPaid = 0;
  let accountsPending = 0;
  let accountsCancelled = 0;

  const paymentsByMonth: Record<string, { totalPaid: number; count: number }> =
    {};

  accounts.forEach((account) => {
    totalAmount += account.totalAmount;
    totalPaid += account.paidAmount;

    if (account.status === 'PAID') {
      accountsPaid += 1;
    } else if (account.status === 'PENDING') {
      accountsPending += 1;
      totalPending += account.remainingAmount;
    } else if (account.status === 'CANCELLED') {
      accountsCancelled += 1;
      totalCancelled += account.totalAmount;
    }

    account.payments.forEach((payment) => {
      const monthKey = format(payment.paymentDate, 'yyyy-MM');
      if (!paymentsByMonth[monthKey]) {
        paymentsByMonth[monthKey] = { totalPaid: 0, count: 0 };
      }
      paymentsByMonth[monthKey].totalPaid += payment.amount;
      paymentsByMonth[monthKey].count += 1;
    });
  });

  const paymentsByMonthArray = Object.entries(paymentsByMonth).map(
    ([month, data]) => ({
      month,
      totalPaid: data.totalPaid,
      paymentsCount: data.count
    })
  );

  const totalPayments = paymentsByMonthArray.reduce(
    (sum, m) => sum + m.paymentsCount,
    0
  );
  const averagePaymentAmount =
    totalPayments > 0 ? totalPaid / totalPayments : 0;

  return {
    totalAccounts,
    totalAmount,
    totalPaid,
    totalPending,
    totalCancelled,
    accountsPaid,
    accountsPending,
    accountsCancelled,
    averagePaymentAmount: Math.round(averagePaymentAmount * 100) / 100,
    paymentsByMonth: paymentsByMonthArray
  };
}

export async function getAccountsReceivableReport(
  filters: PaymentsReportDTO
): Promise<AccountsReceivableReport> {
  const where: Prisma.AccountReceivableWhereInput = {
    isActive: true,
    createdAt: {
      gte: filters.startDate,
      lte: filters.endDate
    }
  };

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  const accounts = await prisma.accountReceivable.findMany({
    where,
    select: {
      id: true,
      totalAmount: true,
      numberOfCuotas: true,
      status: true,
      Payment: {
        where: {
          isActive: true
        },
        select: {
          amount: true
        }
      }
    }
  });

  const totalAccounts = accounts.length;
  let totalAmount = 0;
  let activeAccounts = 0;
  let closedAccounts = 0;
  let totalCuotas = 0;
  let totalPaymentsReceived = 0;

  accounts.forEach((account) => {
    totalAmount += account.totalAmount;
    totalCuotas += account.numberOfCuotas;

    if (account.status === 'ACTIVE') {
      activeAccounts += 1;
    } else if (account.status === 'CLOSED') {
      closedAccounts += 1;
    }

    account.Payment.forEach((payment) => {
      totalPaymentsReceived += payment.amount;
    });
  });

  const averageCuotas = totalAccounts > 0 ? totalCuotas / totalAccounts : 0;

  return {
    totalAccounts,
    totalAmount,
    activeAccounts,
    closedAccounts,
    averageCuotas: Math.round(averageCuotas * 100) / 100,
    totalPaymentsReceived
  };
}

export async function getPatientsReport(
  filters: PatientsReportDTO
): Promise<PatientsReport> {
  const allPatients = await prisma.patient.findMany({
    where: {
      deletedAt: null
    },
    select: {
      id: true,
      gender: true,
      dateOfBirth: true,
      isMinor: true,
      isActive: true,
      createdAt: true
    }
  });

  const newPatients = allPatients.filter(
    (p) => p.createdAt >= filters.startDate && p.createdAt <= filters.endDate
  );

  const totalPatients = allPatients.length;
  const activePatients = allPatients.filter((p) => p.isActive).length;
  const inactivePatients = totalPatients - activePatients;
  const minorPatients = allPatients.filter((p) => p.isMinor).length;

  const genderCount: Record<string, number> = {};
  allPatients.forEach((p) => {
    genderCount[p.gender] = (genderCount[p.gender] || 0) + 1;
  });

  const patientsByGender = Object.entries(genderCount).map(
    ([gender, count]) => ({
      gender,
      count
    })
  );

  const ageRanges: Record<string, number> = {
    '0-10': 0,
    '11-20': 0,
    '21-30': 0,
    '31-40': 0,
    '41-50': 0,
    '51-60': 0,
    '61+': 0
  };

  const today = new Date();
  allPatients.forEach((p) => {
    const age = differenceInDays(today, p.dateOfBirth) / 365;
    if (age <= 10) ageRanges['0-10'] += 1;
    else if (age <= 20) ageRanges['11-20'] += 1;
    else if (age <= 30) ageRanges['21-30'] += 1;
    else if (age <= 40) ageRanges['31-40'] += 1;
    else if (age <= 50) ageRanges['41-50'] += 1;
    else if (age <= 60) ageRanges['51-60'] += 1;
    else ageRanges['61+'] += 1;
  });

  const patientsByAge = Object.entries(ageRanges).map(([ageRange, count]) => ({
    ageRange,
    count
  }));

  return {
    totalPatients,
    newPatients: newPatients.length,
    activePatients,
    inactivePatients,
    patientsByGender,
    patientsByAge,
    minorPatients
  };
}

export async function getExamsReport(
  filters: ExamsReportDTO
): Promise<ExamsReport> {
  const where: Prisma.ExamWhereInput = {
    isActive: true,
    scheduledAt: {
      gte: filters.startDate,
      lte: filters.endDate
    }
  };

  if (filters.examTypeId) {
    where.examTypeId = filters.examTypeId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  const exams = await prisma.exam.findMany({
    where,
    select: {
      id: true,
      status: true,
      examTypeId: true,
      examType: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  const totalExams = exams.length;
  const totalDays = differenceInDays(filters.endDate, filters.startDate) + 1;
  const averageExamsPerDay = totalExams / totalDays;

  const statusCount: Record<string, number> = {};
  exams.forEach((exam) => {
    statusCount[exam.status] = (statusCount[exam.status] || 0) + 1;
  });

  const examsByStatus = Object.entries(statusCount).map(([status, count]) => ({
    status,
    count
  }));

  const typeCount: Record<string, { name: string; count: number }> = {};
  exams.forEach((exam) => {
    if (!typeCount[exam.examTypeId]) {
      typeCount[exam.examTypeId] = {
        name: exam.examType.name,
        count: 0
      };
    }
    typeCount[exam.examTypeId].count += 1;
  });

  const examsByType = Object.entries(typeCount).map(([typeId, data]) => ({
    typeId,
    typeName: data.name,
    count: data.count
  }));

  return {
    totalExams,
    examsByStatus,
    examsByType,
    averageExamsPerDay: Math.round(averageExamsPerDay * 100) / 100
  };
}

export async function getSurveysReport(
  filters: SurveysReportDTO
): Promise<SurveysReport> {
  const patientSurveys = await prisma.patientSurvey.findMany({
    where: {
      isActive: true,
      createdAt: {
        gte: filters.startDate,
        lte: filters.endDate
      }
    },
    select: {
      id: true,
      surveyId: true,
      survey: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  const totalSurveys = patientSurveys.length;

  const surveyCount: Record<string, { name: string; count: number }> = {};
  patientSurveys.forEach((ps) => {
    if (!surveyCount[ps.surveyId]) {
      surveyCount[ps.surveyId] = {
        name: ps.survey.name,
        count: 0
      };
    }
    surveyCount[ps.surveyId].count += 1;
  });

  const surveysByType = Object.entries(surveyCount).map(([surveyId, data]) => ({
    surveyId,
    surveyName: data.name,
    count: data.count
  }));

  return {
    totalSurveys,
    completedSurveys: totalSurveys,
    surveysByType
  };
}
