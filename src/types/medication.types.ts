import type { z } from 'zod';

import type {
  createMedicationSchema,
  updateMedicationSchema,
  getMedicationsQuerySchema,
  medicationIdSchema,
  measureUnitEnum
} from '@/schemas/medication.schema';

// DTOs inferidos de los schemas Zod
export type CreateMedicationDTO = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationDTO = z.infer<typeof updateMedicationSchema>;
export type GetMedicationsQueryDTO = z.infer<typeof getMedicationsQuerySchema>;
export type MedicationIdParams = z.infer<typeof medicationIdSchema>;

// Enum de MeasureUnit
export type MeasureUnit = z.infer<typeof measureUnitEnum>;

// Tipo para medicamento completo
export type Medication = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  code: string;
  stock: number;
  minStock: number;
  price: number;
  costPrice: number;
  measureUnit: MeasureUnit;
  expirationDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
  };
};

// Tipo para respuesta de listado paginado
export type PaginatedMedications = {
  data: Medication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
