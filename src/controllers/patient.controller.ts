import type { Request, Response } from 'express';
import type z from 'zod';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendCreated,
  sendNoContent,
  sendPaginated,
  sendSuccess
} from '@/lib/responses';
import type { patientIdSchema } from '@/schemas/patient.schema';
import * as patientService from '@/services/patient.service';
import type {
  CreatePatientDTO,
  ListPatientsQuery,
  UpdatePatientDTO
} from '@/types/patient.types';

export const createPatient = asyncHandler(
  async (
    req: Request<unknown, unknown, CreatePatientDTO>,
    res: Response
  ): Promise<void> => {
    const {
      address,
      consentAcceptedAt,
      consentMechanism,
      dateOfBirth,
      documentNumber,
      documentType,
      email,
      firstName,
      gender,
      guardianName,
      isMinor,
      lastName,
      medicalRecordNumber,
      phone
    } = req.body;

    const userId = req.currentUser!.id;

    const patient = await patientService.createPatient(
      {
        address,
        consentAcceptedAt,
        consentMechanism,
        dateOfBirth,
        documentNumber,
        documentType,
        email,
        firstName,
        gender,
        guardianName,
        isMinor,
        lastName,
        medicalRecordNumber,
        phone
      },
      userId
    );

    sendCreated(res, patient, 'Paciente creado exitosamente');
  }
);

export const updatePatient = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { patientId } = req.params as z.infer<typeof patientIdSchema>;
    const {
      address,
      consentMechanism,
      dateOfBirth,
      documentNumber,
      documentType,
      email,
      firstName,
      gender,
      guardianName,
      isMinor,
      lastName,
      phone
    } = req.body as UpdatePatientDTO;

    const userId = req.currentUser!.id;

    const patient = await patientService.updatePatient(
      patientId,
      {
        address,
        consentMechanism,
        dateOfBirth,
        documentNumber,
        documentType,
        email,
        firstName,
        gender,
        guardianName,
        isMinor,
        lastName,
        phone
      },
      userId
    );

    sendSuccess(res, patient, 'Paciente actualizado exitosamente');
  }
);

export const deletePatient = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { patientId } = req.params as z.infer<typeof patientIdSchema>;
    const userId = req.currentUser!.id;

    await patientService.deletePatient(patientId, userId);

    sendNoContent(res);
  }
);

export const getPatientById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { patientId } = req.params as z.infer<typeof patientIdSchema>;

    const result = await patientService.getPatientById(patientId);

    sendSuccess(res, result, 'Paciente encontrado exitosamente');
  }
);

export const getAllPatients = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, page, searchBy, search } =
      req.query as unknown as ListPatientsQuery;

    const { patients, total } = await patientService.getAllPatients({
      limit: parseInt(String(limit), 10),
      page: parseInt(String(page), 10),
      searchBy,
      search
    });

    sendPaginated(
      res,
      patients,
      total,
      page,
      limit,
      'Pacientes obtenidos exitosamente'
    );
  }
);
