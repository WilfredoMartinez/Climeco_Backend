import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import * as patientRepository from '@/repositories/patient.repository';
import { logActivity } from '@/services/activityLog.service';
import type {
  CreatePatientDTO,
  ListPatientsQuery,
  Patient,
  UpdatePatientDTO
} from '@/types/patient.types';
import { validateSalvadorDocument } from '@/utils/document-validator';
import { validateSalvadorPhone } from '@/utils/phone-validator';

export async function createPatient(
  data: CreatePatientDTO,
  userId: string
): Promise<Patient> {
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
  } = data;

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const consentDate = new Date(consentAcceptedAt);

  if (birthDate > today)
    throw createBadRequestError(
      'La fecha de nacimiento no puede ser una fecha futura'
    );

  if (consentDate > today)
    throw createBadRequestError(
      'La fecha de consentimiento no puede ser una fecha futura'
    );

  const age: number = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const adjustedAge =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;

  if (adjustedAge > 120)
    throw createBadRequestError(
      'La edad del paciente no puede ser mayor a 120 años'
    );

  const actualIsMinor = adjustedAge < 18;

  if (actualIsMinor !== isMinor)
    throw createBadRequestError(
      `El campo isMinor (${isMinor}) no coincide con la edad calculada (${adjustedAge} años)`
    );

  // Si no se proporciona guardianName, se asigna el nombre completo del paciente
  const guardianNameFinal = guardianName || `${firstName} ${lastName}`;

  if (isMinor && consentMechanism !== 'APODERADO_LEGAL')
    throw createBadRequestError(
      'Los menores de edad solo pueden dar consentimiento mediante APODERADO_LEGAL'
    );

  let cleanedDocumentNumber = documentNumber.trim();

  const { cleaned, errors, isValid } = validateSalvadorDocument(
    documentNumber,
    documentType
  );

  if (!isValid)
    throw createBadRequestError(
      `El formato del ${documentType} es inválido: ${errors.join(', ')}`
    );

  cleanedDocumentNumber = cleaned;

  if (!isMinor) {
    const existingPatient = await patientRepository.findByDocumentNumber(
      cleanedDocumentNumber
    );

    if (existingPatient)
      throw createBadRequestError(
        'El número de documento ya está registrado en el sistema'
      );
  }

  let cleanedPhone = phone;

  if (phone) {
    const { cleaned, isValid, errors } = validateSalvadorPhone(phone);

    if (!isValid)
      throw createBadRequestError(
        `El formato del teléfono es inválido: ${errors.join(', ')}`
      );

    cleanedPhone = cleaned;
  }

  const newPatient = await patientRepository.create({
    firstName,
    lastName,
    documentType,
    documentNumber: cleanedDocumentNumber,
    dateOfBirth: birthDate,
    isMinor,
    guardianName: guardianNameFinal,
    gender,
    email,
    phone: cleanedPhone,
    address,
    consentMechanism,
    consentAcceptedAt: consentDate,
    medicalRecordNumber
  });

  await logActivity({
    userId,
    action: 'PATIENT:CREATE',
    newValue: {
      id: newPatient.id,
      fullName: `${newPatient.firstName} ${newPatient.lastName}`,
      documentNumber: newPatient.documentNumber
    }
  });

  return {
    id: newPatient.id,
    firstName: newPatient.firstName,
    lastName: newPatient.lastName,
    fullName: newPatient.fullName,
    documentType: newPatient.documentType,
    documentNumber: newPatient.documentNumber,
    birthDate: newPatient.birthDate,
    isMinor: newPatient.isMinor,
    guardianName: newPatient.guardianName,
    gender: newPatient.gender,
    email: newPatient.email,
    phone: newPatient.phone,
    address: newPatient.address,
    consentMechanism: newPatient.consentMechanism,
    consentAcceptedAt: newPatient.consentAcceptedAt,
    medicalRecordNumber: newPatient.medicalRecordNumber,
    createdAt: newPatient.createdAt
  };
}

export async function updatePatient(
  patientId: string,
  data: UpdatePatientDTO,
  userId: string
): Promise<Patient> {
  const existingPatient = await patientRepository.findById(patientId);

  if (!existingPatient) throw createNotFoundError('Paciente no encontrado');

  const today = new Date();
  const updateData: Partial<UpdatePatientDTO> = {};

  if (data.dateOfBirth) {
    const birthDate = new Date(data.dateOfBirth);

    if (birthDate > today)
      throw createBadRequestError(
        'La fecha de nacimiento no puede ser una fecha futura'
      );

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const adjustedAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    if (adjustedAge > 120)
      throw createBadRequestError(
        'La edad del paciente no puede ser mayor a 120 años'
      );

    updateData.dateOfBirth = birthDate;

    const actualIsMinor = adjustedAge < 18;
    const isMinorToCheck = data.isMinor ?? existingPatient.isMinor;

    if (actualIsMinor !== isMinorToCheck)
      throw createBadRequestError(
        `El campo isMinor (${isMinorToCheck}) no coincide con la edad calculada (${adjustedAge} años)`
      );
  }

  const finalIsMinor = data.isMinor ?? existingPatient.isMinor;
  const finalGuardianName =
    data.guardianName !== undefined
      ? data.guardianName
      : existingPatient.guardianName;

  if (finalIsMinor && !finalGuardianName)
    throw createBadRequestError('Los menores de edad deben tener un encargado');

  let guardianNameFinal = finalGuardianName;

  if (!finalIsMinor && !finalGuardianName)
    guardianNameFinal = existingPatient.fullName;

  if (data.documentNumber !== undefined || data.documentType !== undefined) {
    const finalDocumentType = data.documentType ?? existingPatient.documentType;
    const finalDocumentNumber =
      data.documentNumber ?? existingPatient.documentNumber;

    let cleanedDocumentNumber = finalDocumentNumber.trim();

    const { cleaned, errors, isValid } = validateSalvadorDocument(
      finalDocumentNumber,
      finalDocumentType
    );

    if (!isValid)
      throw createBadRequestError(
        `El formato del ${finalDocumentType} es inválido: ${errors.join(', ')}`
      );

    cleanedDocumentNumber = cleaned;

    if (cleanedDocumentNumber !== existingPatient.documentNumber) {
      const patientWithSameDocument =
        await patientRepository.findByDocumentNumber(cleanedDocumentNumber);

      if (patientWithSameDocument && patientWithSameDocument.id !== patientId)
        throw createBadRequestError(
          'El número de documento ya está registrado por otro paciente'
        );
    }

    if (data.documentType !== undefined)
      updateData.documentType = data.documentType;

    if (data.documentNumber !== undefined)
      updateData.documentNumber = cleanedDocumentNumber;
  }

  if (data.phone !== undefined) {
    if (data.phone === null) {
      updateData.phone = null;
    } else {
      const { cleaned, isValid, errors } = validateSalvadorPhone(data.phone);

      if (!isValid)
        throw createBadRequestError(
          `El formato del teléfono es inválido: ${errors.join(', ')}`
        );

      updateData.phone = cleaned;
    }
  }

  if (data.email !== undefined) updateData.email = data.email;

  if (data.consentMechanism !== undefined) {
    if (finalIsMinor && data.consentMechanism !== 'APODERADO_LEGAL')
      throw createBadRequestError(
        'Los menores de edad solo pueden dar consentimiento mediante APODERADO_LEGAL'
      );

    updateData.consentMechanism = data.consentMechanism;
  }

  if (data.firstName !== undefined) {
    updateData.firstName = data.firstName.trim();
  }
  if (data.lastName !== undefined) {
    updateData.lastName = data.lastName.trim();
  }
  if (data.isMinor !== undefined) {
    updateData.isMinor = data.isMinor;
  }
  if (data.guardianName !== undefined) {
    updateData.guardianName = guardianNameFinal;
  }
  if (data.gender !== undefined) {
    updateData.gender = data.gender;
  }
  if (data.address !== undefined) {
    updateData.address = data.address;
  }

  const updatedPatient = await patientRepository.update(patientId, updateData);

  await logActivity({
    userId,
    action: 'PATIENT:UPDATE',
    oldValue: {
      id: existingPatient.id,
      fullName: existingPatient.fullName
    },
    newValue: {
      id: updatedPatient.id,
      fullName: updatedPatient.fullName
    }
  });

  return {
    id: updatedPatient.id,
    firstName: updatedPatient.firstName,
    lastName: updatedPatient.lastName,
    fullName: updatedPatient.fullName,
    documentType: updatedPatient.documentType,
    documentNumber: updatedPatient.documentNumber,
    birthDate: updatedPatient.birthDate,
    isMinor: updatedPatient.isMinor,
    guardianName: updatedPatient.guardianName,
    gender: updatedPatient.gender,
    email: updatedPatient.email,
    phone: updatedPatient.phone,
    address: updatedPatient.address,
    consentMechanism: updatedPatient.consentMechanism,
    consentAcceptedAt: updatedPatient.consentAcceptedAt,
    medicalRecordNumber: updatedPatient.medicalRecordNumber,
    createdAt: updatedPatient.createdAt
  };
}

export async function deletePatient(
  patientId: string,
  userId: string
): Promise<void> {
  const existingPatient = await patientRepository.findById(patientId);

  if (!existingPatient) throw createNotFoundError('Paciente no encontrado');

  const patientRecord = await patientRepository.findById(patientId);
  if (!patientRecord)
    throw createBadRequestError('El paciente ya ha sido eliminado');

  await patientRepository.deleteById(patientId);

  await logActivity({
    userId,
    action: 'PATIENT:DELETE',
    oldValue: {
      id: existingPatient.id,
      fullName: existingPatient.fullName,
      documentNumber: existingPatient.documentNumber
    }
  });
}

export async function getPatientById(id: string): Promise<Patient | Patient[]> {
  const patient = await patientRepository.findById(id);

  if (!patient) throw createNotFoundError('Paciente no encontrado');

  return patient;
}

export async function getAllPatients(params: ListPatientsQuery): Promise<{
  patients: Patient[];
  total: number;
}> {
  const { page, limit, search, searchBy } = params;

  const { patients, total } = await patientRepository.findAll({
    page: Number(page),
    limit: Number(limit),
    search,
    searchBy
  });

  return { patients, total };
}
