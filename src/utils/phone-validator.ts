import type { ValidationResult } from '@/types/api';

export function validateSalvadorPhone(phone: string): ValidationResult {
  const errors: string[] = [];

  const cleaned = phone
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/^\+503/, '')
    .replace(/^503/, '');

  if (!/^\d+$/.test(cleaned)) {
    errors.push('El número debe contener solo dígitos');

    return {
      isValid: false,
      cleaned: cleaned,
      errors
    };
  }

  if (cleaned.length !== 8) {
    errors.push(
      `El número debe tener exactamente 8 dígitos (tiene ${cleaned.length})`
    );

    return {
      isValid: false,
      cleaned: cleaned,
      errors
    };
  }

  const firstDigit = cleaned[0];
  if (!['2', '6', '7'].includes(firstDigit)) {
    errors.push('El número debe empezar con 2 (fijo), 6 o 7 (móvil)');

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
