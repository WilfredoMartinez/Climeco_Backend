import type { Request, Response, NextFunction } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated
} from '@/lib/responses';
import * as appointmentService from '@/services/appointment.service';
import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  CancelAppointmentDTO,
  QueryAppointmentsDTO,
  TransitionNotesDTO,
  TransitionToVitalsDTO,
  UpdateVitalSignsDTO,
  AvailableSlotsQueryDTO
} from '@/types/appointment.types';

export const createAppointment = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body as CreateAppointmentDTO;
    const createdBy = req.currentUser!.id;

    const appointment = await appointmentService.createAppointment(
      data,
      createdBy
    );

    sendCreated(res, appointment);
  }
);

export const getAppointmentById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const appointment = await appointmentService.getAppointmentById(id);

    sendSuccess(res, appointment);
  }
);

export const getAppointments = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = req.query as unknown as QueryAppointmentsDTO;

    const { appointments, total } = await appointmentService.getAppointments({
      ...query,
      page: parseInt(String(query.page ?? 1), 10),
      limit: parseInt(String(query.limit ?? 10), 10)
    });

    sendPaginated(res, appointments, total, query.page ?? 1, query.limit ?? 10);
  }
);

export const getVitalSigns = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const vitalSigns =
      await appointmentService.getVitalSignsByAppointmentId(id);

    sendSuccess(res, vitalSigns);
  }
);

export const updateVitalSigns = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as UpdateVitalSignsDTO;
    const userId = req.currentUser!.id;

    const vitalSigns = await appointmentService.updateVitalSigns(
      id,
      data,
      userId
    );

    sendSuccess(res, vitalSigns);
  }
);

export const updateAppointment = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as UpdateAppointmentDTO;
    const userId = req.currentUser!.id;

    const appointment = await appointmentService.updateAppointment(
      id,
      data,
      userId
    );

    sendSuccess(res, appointment);
  }
);

export const cancelAppointment = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as CancelAppointmentDTO;
    const userId = req.currentUser!.id;

    const appointment = await appointmentService.cancelAppointment(
      id,
      data,
      userId
    );

    sendSuccess(res, appointment);
  }
);

export const deleteAppointment = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    await appointmentService.deleteAppointment(id, userId);

    sendNoContent(res, 'Cita eliminada exitosamente');
  }
);

export const transitionToVitals = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as TransitionToVitalsDTO;
    const userId = req.currentUser!.id;

    const appointment = await appointmentService.transitionToVitals(
      id,
      data,
      userId
    );

    sendSuccess(res, appointment);
  }
);

export const transitionToInProgress = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as TransitionNotesDTO;
    const userId = req.currentUser!.id;

    const appointment = await appointmentService.transitionToInProgress(
      id,
      data,
      userId
    );

    sendSuccess(res, appointment);
  }
);

export const transitionToReady = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as TransitionNotesDTO;
    const userId = req.currentUser!.id;

    const appointment = await appointmentService.transitionToReady(
      id,
      data,
      userId
    );

    sendSuccess(res, appointment);
  }
);

export const transitionToCompleted = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as TransitionNotesDTO;
    const userId = req.currentUser!.id;

    const appointment = await appointmentService.transitionToCompleted(
      id,
      data,
      userId
    );

    sendSuccess(res, appointment);
  }
);

export const transitionToNoShow = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body as TransitionNotesDTO;
    const userId = req.currentUser!.id;

    const appointment = await appointmentService.transitionToNoShow(
      id,
      data,
      userId
    );

    sendSuccess(res, appointment);
  }
);

export const getAvailableSlots = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = (res.locals.validatedQuery ||
      req.query) as AvailableSlotsQueryDTO;

    const result = await appointmentService.getAvailableSlots(
      query.date,
      query.userId
    );

    sendSuccess(res, result);
  }
);

export const getPatientInfoInAppointment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    const patientInfo = await appointmentService.getPatientInfoInAppointment(
      id,
      userId
    );

    sendSuccess(
      res,
      patientInfo,
      'Información del paciente obtenida exitosamente'
    );
  }
);

export const completeDentalConsultation = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const data = req.body;
    const userId = req.currentUser!.id;

    const result = await appointmentService.completeDentalConsultation(
      id,
      data,
      userId
    );

    sendSuccess(res, result, 'Consulta dental completada exitosamente');
  }
);
