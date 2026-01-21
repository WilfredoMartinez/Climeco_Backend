import { createBadRequestError, createNotFoundError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as surveyRepository from '@/repositories/survey.repository';
import { logActivity } from '@/services/activityLog.service';
import type {
  CreateQuestionDTO,
  CreateSurveyDTO,
  GetSurveysQueryDTO,
  PaginatedSurveys,
  Question,
  ReorderQuestionsDTO,
  Survey,
  SurveyWithQuestions,
  UpdateQuestionDTO,
  UpdateSurveyDTO
} from '@/types/survey.types';
import {
  generateRankBetween,
  generateRanksForArray,
  reorderByIdArray
} from '@/utils/lexorank';

export async function createSurvey(
  data: CreateSurveyDTO,
  userId: string
): Promise<SurveyWithQuestions> {
  const existingSurvey = await surveyRepository.findSurveyByName(data.name);

  if (existingSurvey) {
    throw createBadRequestError('Ya existe un cuestionario con ese nombre');
  }

  if (data.questions && data.questions.length > 100) {
    throw createBadRequestError('Máximo 100 preguntas por cuestionario');
  }

  return await prisma.$transaction(async (tx) => {
    const survey = await surveyRepository.createSurvey(
      {
        name: data.name,
        description: data.description
      },
      tx
    );

    let questions: Question[] = [];

    if (data.questions && data.questions.length > 0) {
      const ranks = generateRanksForArray(data.questions.length);
      const questionsData = data.questions.map((q, index) => ({
        text: q.text,
        requireComment: q.requireComment,
        order: ranks[index]
      }));

      await surveyRepository.createManyQuestions(survey.id, questionsData, tx);

      questions = await surveyRepository.getQuestionsBySurveyId(survey.id, tx);
    }

    await logActivity({
      userId,
      action: 'SURVEY:CREATE',
      newValue: {
        surveyId: survey.id,
        name: survey.name,
        questionsCount: questions.length
      },
      tx
    });

    return {
      ...survey,
      questions
    };
  });
}

export async function getSurveys(
  query: GetSurveysQueryDTO
): Promise<PaginatedSurveys> {
  return await surveyRepository.findAllSurveys(
    query.page,
    query.limit,
    query.search
  );
}

export async function getSurveyById(id: string): Promise<SurveyWithQuestions> {
  const survey = await surveyRepository.findSurveyById(id);

  if (!survey) {
    throw createNotFoundError('Cuestionario no encontrado');
  }

  return survey;
}

export async function updateSurvey(
  id: string,
  data: UpdateSurveyDTO,
  userId: string
): Promise<Survey> {
  const survey = await surveyRepository.findSurveyById(id);

  if (!survey) {
    throw createNotFoundError('Cuestionario no encontrado');
  }

  if (data.name) {
    const existingSurvey = await surveyRepository.findSurveyByName(data.name);

    if (existingSurvey && existingSurvey.id !== id) {
      throw createBadRequestError('Ya existe un cuestionario con ese nombre');
    }
  }

  const updatedSurvey = await surveyRepository.updateSurvey(id, data);

  await logActivity({
    userId,
    action: 'SURVEY:UPDATE',
    oldValue: { id: survey.id, name: survey.name },
    newValue: { id: updatedSurvey.id, name: updatedSurvey.name }
  });

  return updatedSurvey;
}

export async function deleteSurvey(id: string, userId: string): Promise<void> {
  const survey = await surveyRepository.findSurveyById(id);

  if (!survey) {
    throw createNotFoundError('Cuestionario no encontrado');
  }

  await surveyRepository.deleteSurvey(id);

  await logActivity({
    userId,
    action: 'SURVEY:DELETE',
    oldValue: { id: survey.id, name: survey.name }
  });
}

export async function createQuestion(
  surveyId: string,
  data: CreateQuestionDTO,
  userId: string
): Promise<Question> {
  const survey = await surveyRepository.findSurveyById(surveyId);

  if (!survey) {
    throw createNotFoundError('Cuestionario no encontrado');
  }

  const currentQuestionsCount =
    await surveyRepository.countQuestionsBySurvey(surveyId);

  if (currentQuestionsCount >= 100) {
    throw createBadRequestError('Máximo 100 preguntas por cuestionario');
  }

  let order: string;

  if (data.order) {
    order = data.order;
  } else {
    const existingQuestions =
      await surveyRepository.getQuestionsBySurveyId(surveyId);
    const lastQuestion = existingQuestions[existingQuestions.length - 1];
    order = lastQuestion
      ? generateRankBetween(lastQuestion.order, null)
      : generateRankBetween(null, null);
  }

  const question = await surveyRepository.createQuestion(surveyId, {
    text: data.text,
    requireComment: data.requireComment,
    order
  });

  await logActivity({
    userId,
    action: 'QUESTION:CREATE',
    newValue: {
      questionId: question.id,
      surveyId,
      text: question.text
    }
  });

  return question;
}

export async function updateQuestion(
  questionId: string,
  data: UpdateQuestionDTO,
  userId: string
): Promise<Question> {
  const question = await surveyRepository.findQuestionById(questionId);

  if (!question) {
    throw createNotFoundError('Pregunta no encontrada');
  }

  const updatedQuestion = await surveyRepository.updateQuestion(
    questionId,
    data
  );

  await logActivity({
    userId,
    action: 'QUESTION:UPDATE',
    oldValue: { id: question.id, text: question.text },
    newValue: { id: updatedQuestion.id, text: updatedQuestion.text }
  });

  return updatedQuestion;
}

export async function deleteQuestion(
  questionId: string,
  userId: string
): Promise<void> {
  const question = await surveyRepository.findQuestionById(questionId);

  if (!question) {
    throw createNotFoundError('Pregunta no encontrada');
  }

  await surveyRepository.deleteQuestion(questionId);

  await logActivity({
    userId,
    action: 'QUESTION:DELETE',
    oldValue: { id: question.id, text: question.text }
  });
}

export async function reorderQuestions(
  surveyId: string,
  data: ReorderQuestionsDTO,
  userId: string
): Promise<Question[]> {
  const survey = await surveyRepository.findSurveyById(surveyId);

  if (!survey) {
    throw createNotFoundError('Cuestionario no encontrado');
  }

  const existingQuestions =
    await surveyRepository.getQuestionsBySurveyId(surveyId);

  const existingQuestionIds = new Set(existingQuestions.map((q) => q.id));
  const providedQuestionIds = new Set(data.questionIds);

  if (existingQuestionIds.size !== providedQuestionIds.size) {
    throw createBadRequestError(
      'Debe proporcionar todos los IDs de las preguntas activas'
    );
  }

  for (const id of data.questionIds) {
    if (!existingQuestionIds.has(id)) {
      throw createBadRequestError(
        `La pregunta ${id} no pertenece al cuestionario`
      );
    }
  }

  const updates = reorderByIdArray(existingQuestions, data.questionIds);

  await prisma.$transaction(async (tx) => {
    await surveyRepository.updateQuestionOrders(updates, tx);

    await logActivity({
      userId,
      action: 'QUESTIONS:REORDER',
      newValue: {
        surveyId,
        questionIds: data.questionIds
      },
      tx
    });
  });

  return await surveyRepository.getQuestionsBySurveyId(surveyId);
}
