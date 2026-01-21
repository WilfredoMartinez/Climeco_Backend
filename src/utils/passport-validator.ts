import type { ValidationResult } from '@/types/api';

export function validateSalvadorPassport(passport: string): ValidationResult {
  const errors: string[] = [];

  const cleaned = passport
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .toUpperCase();

  if (!/^[A-Z]\d{8}$/.test(cleaned)) {
    errors.push(
      'El pasaporte debe tener el formato: una letra seguida de 8 dígitos (ejemplo: A12345678)'
    );

    return {
      isValid: false,
      cleaned: cleaned,
      errors
    };
  }

  const initialLetter = cleaned[0];
  const validInitialLetters = ['A', 'P', 'T', 'D'];

  if (!validInitialLetters.includes(initialLetter)) {
    errors.push(
      `La letra inicial '${initialLetter}' no es válida para pasaportes salvadoreños`
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
