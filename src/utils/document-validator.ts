import type { ValidationResult } from '@/types/api';
import type { DocumentType } from '@/types/patient.enums';
import { validateSalvadorDUI } from '@/utils/dui-validator';
import { validateSalvadorNIT } from '@/utils/nit-validator';
import { validateSalvadorPassport } from '@/utils/passport-validator';

interface DocumentValidationResult extends ValidationResult {
  documentType: DocumentType;
}

export function validateSalvadorDocument(
  document: string,
  type: DocumentType
): DocumentValidationResult {
  let result: ValidationResult;

  switch (type) {
    case 'DUI':
      result = validateSalvadorDUI(document);
      break;
    case 'NIT':
      result = validateSalvadorNIT(document);
      break;
    case 'PASSPORT':
      result = validateSalvadorPassport(document);
      break;
    default:
      result = {
        isValid: false,
        cleaned: document,
        errors: ['Tipo de documento no válido']
      };
  }

  return {
    ...result,
    documentType: type
  };
}
