import type { Request, Response } from 'express';

import { asyncHandler } from '@/lib/asyncHandler';
import {
  sendCreated,
  sendNoContent,
  sendPaginated,
  sendSuccess
} from '@/lib/responses';
import * as surveyService from '@/services/survey.service';
import type {
  CreateQuestionDTO,
  CreateSurveyDTO,
  GetSurveysQueryDTO,
  ReorderQuestionsDTO,
  UpdateQuestionDTO,
  UpdateSurveyDTO
} from '@/types/survey.types';

export const createSurvey = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = req.body as CreateSurveyDTO;
    const userId = req.currentUser!.id;

    const survey = await surveyService.createSurvey(data, userId);

    sendCreated(res, survey, 'Cuestionario creado exitosamente');
  }
);

export const getSurveys = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const query = (res.locals.validatedQuery ||
      req.query) as unknown as GetSurveysQueryDTO;

    const result = await surveyService.getSurveys(query);

    sendPaginated(
      res,
      result.data,
      result.pagination.total,
      query.page,
      query.limit,
      'Cuestionarios obtenidos exitosamente'
    );
  }
);

export const getSurveyById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const survey = await surveyService.getSurveyById(id);

    sendSuccess(res, survey, 'Cuestionario obtenido exitosamente', 200);
  }
);

export const updateSurvey = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as UpdateSurveyDTO;
    const userId = req.currentUser!.id;

    const survey = await surveyService.updateSurvey(id, data, userId);

    sendSuccess(res, survey, 'Cuestionario actualizado exitosamente', 200);
  }
);

export const deleteSurvey = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    await surveyService.deleteSurvey(id, userId);

    sendNoContent(res);
  }
);

export const createQuestion = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as CreateQuestionDTO;
    const userId = req.currentUser!.id;

    const question = await surveyService.createQuestion(id, data, userId);

    sendCreated(res, question, 'Pregunta creada exitosamente');
  }
);

export const updateQuestion = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { questionId } = req.params;
    const data = req.body as UpdateQuestionDTO;
    const userId = req.currentUser!.id;

    const question = await surveyService.updateQuestion(
      questionId,
      data,
      userId
    );

    sendSuccess(res, question, 'Pregunta actualizada exitosamente', 200);
  }
);

export const deleteQuestion = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { questionId } = req.params;
    const userId = req.currentUser!.id;

    await surveyService.deleteQuestion(questionId, userId);

    sendNoContent(res);
  }
);

export const reorderQuestions = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body as ReorderQuestionsDTO;
    const userId = req.currentUser!.id;

    const questions = await surveyService.reorderQuestions(id, data, userId);

    sendSuccess(res, questions, 'Preguntas reordenadas exitosamente', 200);
  }
);
