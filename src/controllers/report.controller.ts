import type { Request, Response, NextFunction } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import { sendSuccess } from '@/lib/responses';
import * as reportService from '@/services/report.service';
import type {
  AppointmentsReportDTO,
  PaymentsReportDTO,
  PatientsReportDTO,
  ExamsReportDTO,
  SurveysReportDTO
} from '@/types/report.types';

export const getAppointmentsReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = (res.locals.validatedQuery ||
      req.query) as AppointmentsReportDTO;

    const report = await reportService.getAppointmentsReport(query);

    sendSuccess(res, report);
  }
);

export const getPaymentsSummaryReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = (res.locals.validatedQuery || req.query) as PaymentsReportDTO;

    const report = await reportService.getPaymentsSummaryReport(query);

    sendSuccess(res, report);
  }
);

export const getAccountsReceivableReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = (res.locals.validatedQuery || req.query) as PaymentsReportDTO;

    const report = await reportService.getAccountsReceivableReport(query);

    sendSuccess(res, report);
  }
);

export const getPatientsReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = (res.locals.validatedQuery || req.query) as PatientsReportDTO;

    const report = await reportService.getPatientsReport(query);

    sendSuccess(res, report);
  }
);

export const getExamsReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = (res.locals.validatedQuery || req.query) as ExamsReportDTO;

    const report = await reportService.getExamsReport(query);

    sendSuccess(res, report);
  }
);

export const getSurveysReport = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = (res.locals.validatedQuery || req.query) as SurveysReportDTO;

    const report = await reportService.getSurveysReport(query);

    sendSuccess(res, report);
  }
);
