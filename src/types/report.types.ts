import type { z } from 'zod';

import type {
  appointmentsReportSchema,
  paymentsReportSchema,
  patientsReportSchema,
  examsReportSchema,
  surveysReportSchema
} from '@/schemas/report.schema';

export type DateRangeDTO = {
  startDate: Date;
  endDate: Date;
};

export type AppointmentsReportDTO = z.infer<typeof appointmentsReportSchema>;
export type PaymentsReportDTO = z.infer<typeof paymentsReportSchema>;
export type PatientsReportDTO = z.infer<typeof patientsReportSchema>;
export type ExamsReportDTO = z.infer<typeof examsReportSchema>;
export type SurveysReportDTO = z.infer<typeof surveysReportSchema>;

export interface AppointmentsByStatusReport {
  status: string;
  count: number;
  percentage: number;
}

export interface AppointmentsByDoctorReport {
  doctorId: string;
  doctorName: string;
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  noShowAppointments: number;
  averageDuration: number;
}

export interface AppointmentsAverageReport {
  totalAppointments: number;
  totalDays: number;
  averagePerDay: number;
  byStatus: AppointmentsByStatusReport[];
  byDoctor: AppointmentsByDoctorReport[];
}

export interface PaymentsSummaryReport {
  totalAccounts: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  totalCancelled: number;
  accountsPaid: number;
  accountsPending: number;
  accountsCancelled: number;
  averagePaymentAmount: number;
  paymentsByMonth: {
    month: string;
    totalPaid: number;
    paymentsCount: number;
  }[];
}

export interface AccountsReceivableReport {
  totalAccounts: number;
  totalAmount: number;
  activeAccounts: number;
  closedAccounts: number;
  averageCuotas: number;
  totalPaymentsReceived: number;
}

export interface PatientsReport {
  totalPatients: number;
  newPatients: number;
  activePatients: number;
  inactivePatients: number;
  patientsByGender: {
    gender: string;
    count: number;
  }[];
  patientsByAge: {
    ageRange: string;
    count: number;
  }[];
  minorPatients: number;
}

export interface ExamsReport {
  totalExams: number;
  examsByStatus: {
    status: string;
    count: number;
  }[];
  examsByType: {
    typeId: string;
    typeName: string;
    count: number;
  }[];
  averageExamsPerDay: number;
}

export interface SurveysReport {
  totalSurveys: number;
  completedSurveys: number;
  surveysByType: {
    surveyId: string;
    surveyName: string;
    count: number;
  }[];
}
