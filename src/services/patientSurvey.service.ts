import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as patientRepository from '@/repositories/patient.repository';
import * as patientSurveyRepository from '@/repositories/patientSurvey.repository';
import * as surveyRepository from '@/repositories/survey.repository';
import * as userRepository from '@/repositories/user.repository';
import { logActivity } from '@/services/activityLog.service';
import type {
  AssignSurveyDTO,
  GetPatientSurveysQueryDTO,
  PaginatedPatientSurveys,
  PatientSurveyWithDetails
} from '@/types/patientSurvey.types';

export async function assignSurveyToPatient(
  data: AssignSurveyDTO,
  userId: string
): Promise<PatientSurveyWithDetails> {
  const patient = await patientRepository.findById(data.patientId);

  if (!patient) {
    throw createNotFoundError('Paciente no encontrado');
  }

  const survey = await surveyRepository.findSurveyById(data.surveyId);

  if (!survey) {
    throw createNotFoundError('Cuestionario no encontrado');
  }

  if (!survey.isActive) {
    throw createBadRequestError('No se pueden asignar cuestionarios inactivos');
  }

  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw createNotFoundError('Usuario no encontrado');
  }

  const existingSurveyToday =
    await patientSurveyRepository.findExistingSurveyForPatientToday(
      data.patientId,
      data.surveyId
    );

  if (existingSurveyToday) {
    throw createBadRequestError(
      'Ya se asignó este cuestionario al paciente hoy'
    );
  }

  const activeQuestions = survey.questions.filter((q) => q.isActive);

  if (activeQuestions.length === 0) {
    throw createBadRequestError('El cuestionario no tiene preguntas activas');
  }

  if (data.answers.length !== activeQuestions.length) {
    throw createBadRequestError(
      `Debe proporcionar respuestas para todas las ${activeQuestions.length} preguntas activas`
    );
  }

  const activeQuestionIds = new Set(activeQuestions.map((q) => q.id));
  const answerQuestionIds = new Set(data.answers.map((a) => a.questionId));

  if (activeQuestionIds.size !== answerQuestionIds.size) {
    throw createBadRequestError(
      'Debe responder exactamente todas las preguntas activas del cuestionario'
    );
  }

  for (const questionId of answerQuestionIds) {
    if (!activeQuestionIds.has(questionId)) {
      throw createBadRequestError(
        `La pregunta ${questionId} no pertenece al cuestionario o está inactiva`
      );
    }
  }

  for (const answer of data.answers) {
    const question = activeQuestions.find((q) => q.id === answer.questionId);

    if (question?.requireComment && !answer.comment) {
      throw createBadRequestError(
        `La pregunta "${question.text}" requiere un comentario`
      );
    }
  }

  return await prisma.$transaction(async (tx) => {
    const previousActiveSurvey =
      await patientSurveyRepository.findPreviousActivePatientSurvey(
        data.patientId,
        data.surveyId,
        tx
      );

    if (previousActiveSurvey) {
      const previousDate = new Date(previousActiveSurvey.createdAt);
      previousDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (previousDate.getTime() !== today.getTime()) {
        await patientSurveyRepository.deactivatePatientSurvey(
          previousActiveSurvey.id,
          tx
        );

        await logActivity({
          userId,
          action: 'PATIENT_SURVEY:DEACTIVATE',
          oldValue: {
            id: previousActiveSurvey.id,
            patientId: data.patientId,
            surveyId: data.surveyId
          },
          tx
        });
      }
    }

    const patientSurvey = await patientSurveyRepository.create(
      {
        patientId: data.patientId,
        surveyId: data.surveyId,
        completedBy: userId
      },
      tx
    );

    await patientSurveyRepository.createAnswers(
      patientSurvey.id,
      data.answers,
      tx
    );

    await logActivity({
      userId,
      action: 'PATIENT_SURVEY:CREATE',
      newValue: {
        id: patientSurvey.id,
        patientId: data.patientId,
        surveyId: data.surveyId,
        answersCount: data.answers.length
      },
      tx
    });

    const result = await patientSurveyRepository.findById(patientSurvey.id, tx);

    if (!result) {
      throw createNotFoundError('Error al recuperar el cuestionario asignado');
    }

    return result;
  });
}

export async function getPatientSurveys(
  query: GetPatientSurveysQueryDTO
): Promise<PaginatedPatientSurveys> {
  const filters = {
    patientId: query.patientId,
    surveyId: query.surveyId,
    isActive: query.isActive
  };

  const { patientSurveys, total } = await patientSurveyRepository.findAll(
    filters,
    query.page,
    query.limit
  );

  return {
    data: patientSurveys,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    }
  };
}

export async function getPatientSurveyById(
  id: string
): Promise<PatientSurveyWithDetails> {
  const patientSurvey = await patientSurveyRepository.findById(id);

  if (!patientSurvey) {
    throw createNotFoundError('Cuestionario de paciente no encontrado');
  }

  return patientSurvey;
}
