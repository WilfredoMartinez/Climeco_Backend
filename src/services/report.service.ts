import * as reportRepository from '@/repositories/report.repository';
import type {
  AppointmentsReportDTO,
  PaymentsReportDTO,
  PatientsReportDTO,
  ExamsReportDTO,
  SurveysReportDTO,
  AppointmentsAverageReport,
  PaymentsSummaryReport,
  AccountsReceivableReport,
  PatientsReport,
  ExamsReport,
  SurveysReport
} from '@/types/report.types';

export async function getAppointmentsReport(
  filters: AppointmentsReportDTO
): Promise<AppointmentsAverageReport> {
  return await reportRepository.getAppointmentsReport(filters);
}

export async function getPaymentsSummaryReport(
  filters: PaymentsReportDTO
): Promise<PaymentsSummaryReport> {
  return await reportRepository.getPaymentsSummaryReport(filters);
}

export async function getAccountsReceivableReport(
  filters: PaymentsReportDTO
): Promise<AccountsReceivableReport> {
  return await reportRepository.getAccountsReceivableReport(filters);
}

export async function getPatientsReport(
  filters: PatientsReportDTO
): Promise<PatientsReport> {
  return await reportRepository.getPatientsReport(filters);
}

export async function getExamsReport(
  filters: ExamsReportDTO
): Promise<ExamsReport> {
  return await reportRepository.getExamsReport(filters);
}

export async function getSurveysReport(
  filters: SurveysReportDTO
): Promise<SurveysReport> {
  return await reportRepository.getSurveysReport(filters);
}
