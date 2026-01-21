import type { Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated
} from '@/lib/responses';
import * as medicationService from '@/services/medication.service';
import type {
  CreateMedicationDTO,
  UpdateMedicationDTO,
  GetMedicationsQueryDTO
} from '@/types/medication.types';

/**
 * Crear un medicamento
 */
export const createMedication = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body as CreateMedicationDTO;

    const medication = await medicationService.createMedication(data);

    sendCreated(res, medication, 'Medicamento creado exitosamente');
  }
);

/**
 * Obtener medicamentos con paginación
 */
export const getMedications = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as unknown as GetMedicationsQueryDTO;

    const { data, pagination } = await medicationService.getMedications({
      ...query,
      page: parseInt(String(query.page), 10),
      limit: parseInt(String(query.limit), 10)
    });

    sendPaginated(
      res,
      data,
      pagination.total,
      query.page,
      query.limit,
      'Medicamentos obtenidos exitosamente'
    );
  }
);

/**
 * Obtener un medicamento por ID
 */
export const getMedicationById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const medication = await medicationService.getMedicationById(id);

    sendSuccess(res, medication, 'Medicamento obtenido exitosamente', 200);
  }
);

/**
 * Actualizar un medicamento
 */
export const updateMedication = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as UpdateMedicationDTO;

    const medication = await medicationService.updateMedication(id, data);

    sendSuccess(res, medication, 'Medicamento actualizado exitosamente', 200);
  }
);

/**
 * Eliminar un medicamento
 */
export const deleteMedication = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    await medicationService.deleteMedication(id);

    sendNoContent(res);
  }
);
