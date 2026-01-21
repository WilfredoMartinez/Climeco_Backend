import type { ValidationResult } from '@/types/api';

export function validateSalvadorDUI(dui: string): ValidationResult {
  const errors: string[] = [];

  const cleaned = dui
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '');

  if (!/^\d+$/.test(cleaned)) {
    errors.push('El DUI debe contener solo dígitos');

    return {
      isValid: false,
      cleaned: cleaned,
      errors
    };
  }

  if (cleaned.length !== 9) {
    errors.push(
      `El DUI debe tener exactamente 9 dígitos (tiene ${cleaned.length})`
    );

    return {
      isValid: false,
      cleaned: cleaned,
      errors
    };
  }

  return {
    isValid: true,
    cleaned,
    errors: []
  };
}
