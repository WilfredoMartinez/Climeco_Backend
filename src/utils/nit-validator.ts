import type { ValidationResult } from '@/types/api';

export function validateSalvadorNIT(nit: string): ValidationResult {
  const errors: string[] = [];

  const cleaned = nit
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .toUpperCase();

  if (!/^[0-9]+[0-9K]$/i.test(cleaned)) {
    errors.push(
      'El NIT debe contener solo dígitos y terminar en dígito o la letra K'
    );

    return {
      isValid: false,
      cleaned: cleaned,
      errors
    };
  }

  if (cleaned.length !== 14 && cleaned.length !== 17) {
    errors.push(
      `El NIT debe tener 14 dígitos (personas naturales) o 17 dígitos (personas jurídicas) (tiene ${cleaned.length})`
    );

    return {
      isValid: false,
      cleaned: cleaned,
      errors
    };
  }

  const nitBody = cleaned.slice(0, cleaned.length - 1);
  const checkDigitChar = cleaned[cleaned.length - 1];

  let sum = 0;
  let factor = 2;

  for (let i = nitBody.length - 1; i >= 0; i--) {
    const digit = parseInt(nitBody[i], 10);
    sum += digit * factor;
    factor++;
    if (factor > 9) factor = 2;
  }

  const remainder = sum % 11;
  let calculatedCheckDigit = 11 - remainder;

  if (calculatedCheckDigit === 11) calculatedCheckDigit = 0;
  if (calculatedCheckDigit === 10) calculatedCheckDigit = 1;

  const calculatedCheckDigitChar =
    calculatedCheckDigit === 10 ? 'K' : calculatedCheckDigit.toString();

  if (calculatedCheckDigitChar !== checkDigitChar) {
    errors.push('NIT inválido: el dígito verificador no coincide');

    return {
      isValid: false,
      cleaned,
      errors
    };
  }

  return {
    isValid: true,
    cleaned,
    errors: []
  };
}
