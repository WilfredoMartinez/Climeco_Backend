export interface AppError extends Error {
  status: number;
  message: string;
}

export interface TokenPayload {
  id: string;
  permissionGroups: string[];
  role: string;
  username: string;
  area: string; // MEDICINA_GENERAL | ODONTOLOGIA
}

export interface ValidationResult {
  isValid: boolean;
  cleaned: string;
  errors: string[];
}
