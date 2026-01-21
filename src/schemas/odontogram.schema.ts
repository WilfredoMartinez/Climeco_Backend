import { z } from 'zod';

const toothConditionEnum = z.enum([
  'HEALTHY',
  'CARIES',
  'FILLED',
  'FRACTURED',
  'MISSING',
  'CROWN',
  'BRIDGE',
  'IMPLANT',
  'ROOT_CANAL',
  'EXTRACTION_NEEDED',
  'WISDOM_TOOTH'
]);

export const toothSchema = z.object({
  toothNumber: z
    .number()
    .int()
    .min(1)
    .max(48)
    .describe('Número del diente (1-32 universal o 11-48 FDI)'),
  position: z.string().min(1).max(10).describe('Posición del diente'),
  quadrant: z
    .number()
    .int()
    .min(1)
    .max(4)
    .nullable()
    .optional()
    .describe('Cuadrante: 1=Sup Der, 2=Sup Izq, 3=Inf Izq, 4=Inf Der'),
  affectedSurfaces: z
    .string()
    .max(100)
    .nullable()
    .optional()
    .describe('Superficies afectadas separadas por coma'),
  condition: toothConditionEnum.default('HEALTHY'),
  notes: z.string().max(500).nullable().optional()
});

export const createOdontogramSchema = z.object({
  dentalHistoryId: z.string().uuid('ID de historial dental inválido'),
  teeth: z
    .array(toothSchema)
    .min(1, 'Debe incluir al menos un diente')
    .max(32, 'Máximo 32 dientes permitidos')
});

export const updateOdontogramSchema = z.object({
  teeth: z
    .array(toothSchema)
    .min(1, 'Debe incluir al menos un diente')
    .max(32, 'Máximo 32 dientes permitidos')
});

export const updateToothSchema = z.object({
  affectedSurfaces: z.string().max(100).nullable().optional(),
  condition: toothConditionEnum.optional(),
  notes: z.string().max(500).nullable().optional()
});

export const odontogramIdSchema = z.object({
  id: z.string().uuid('ID de odontograma inválido')
});

export const toothIdSchema = z.object({
  id: z.string().uuid('ID de odontograma inválido'),
  toothId: z.string().uuid('ID de diente inválido')
});

export const dentalHistoryIdParamSchema = z.object({
  dentalHistoryId: z.string().uuid('ID de historial dental inválido')
});
