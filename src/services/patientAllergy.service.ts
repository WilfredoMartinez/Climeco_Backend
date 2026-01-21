import { createNotFoundError, createBadRequestError } from '@/lib/errors';
import * as patientAllergyRepository from '@/repositories/patientAllergy.repository';
import { logActivity } from '@/services/activityLog.service';
import type {
  AssignAllergyDTO,
  PatientAllergies
} from '@/types/patientAllergy.types';

export const assignAllergy = async (
  patientId: string,
  data: AssignAllergyDTO,
  userId: string
): Promise<{ id: string }> => {
  const patientExistsCheck =
    await patientAllergyRepository.patientExists(patientId);

  if (!patientExistsCheck)
    throw createNotFoundError('El paciente especificado no existe');

  const allergyExistsCheck = await patientAllergyRepository.allergyExists(
    data.allergyId
  );

  if (!allergyExistsCheck)
    throw createBadRequestError('La alergia especificada no existe');

  const existingRelation =
    await patientAllergyRepository.findPatientAllergyRelation(
      patientId,
      data.allergyId
    );

  if (existingRelation && existingRelation.isActive)
    throw createBadRequestError('El paciente ya tiene asignada esta alergia');

  if (existingRelation && !existingRelation.isActive) {
    const reactivated = await patientAllergyRepository.reactivatePatientAllergy(
      existingRelation.id
    );

    await logActivity({
      userId,
      action: 'PATIENT_ALLERGY:REACTIVATE',
      newValue: {
        patientId,
        patientAllergyId: reactivated.id,
        allergyId: data.allergyId
      }
    });

    return { id: reactivated.id };
  }

  const created = await patientAllergyRepository.createPatientAllergy(
    patientId,
    data.allergyId
  );

  await logActivity({
    userId,
    action: 'PATIENT_ALLERGY:CREATE',
    newValue: {
      patientId,
      patientAllergyId: created.id,
      allergyId: data.allergyId
    }
  });

  return { id: created.id };
};

export const removeAllergy = async (
  patientId: string,
  patientAllergyId: string,
  userId: string
): Promise<void> => {
  const patientExistsCheck =
    await patientAllergyRepository.patientExists(patientId);

  if (!patientExistsCheck)
    throw createNotFoundError('El paciente especificado no existe');

  const activeRelation =
    await patientAllergyRepository.findActivePatientAllergyById(
      patientAllergyId,
      patientId
    );

  if (!activeRelation)
    throw createNotFoundError(
      'La relación paciente-alergia no existe o ya está inactiva'
    );

  await patientAllergyRepository.removePatientAllergyById(patientAllergyId);

  await logActivity({
    userId,
    action: 'PATIENT_ALLERGY:REMOVE',
    oldValue: {
      patientId,
      patientAllergyId,
      allergyId: activeRelation.allergyTypeId
    }
  });
};

export const getPatientAllergies = async (
  patientId: string
): Promise<PatientAllergies[]> => {
  const patientExistsCheck =
    await patientAllergyRepository.patientExists(patientId);

  if (!patientExistsCheck)
    throw createNotFoundError('El paciente especificado no existe');

  return await patientAllergyRepository.getPatientAllergies(patientId);
};
