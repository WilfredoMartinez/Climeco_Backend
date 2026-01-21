import { Router } from 'express';

import {
  createQuestion,
  createSurvey,
  deleteSurvey,
  deleteQuestion,
  getSurveyById,
  getSurveys,
  reorderQuestions,
  updateQuestion,
  updateSurvey
} from '@/controllers/survey.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate, validateMultiple } from '@/middlewares/validation';
import {
  createQuestionSchema,
  createSurveySchema,
  getSurveysQuerySchema,
  questionIdSchema,
  reorderQuestionsSchema,
  surveyIdSchema,
  updateQuestionSchema,
  updateSurveySchema
} from '@/schemas/survey.schema';

const surveysRouter = Router();

surveysRouter.use(authenticate);

surveysRouter.get(
  '/',
  authorize(['surveys:read']),
  validate(getSurveysQuerySchema, 'query'),
  getSurveys
);

surveysRouter.post(
  '/',
  authorize(['surveys:create']),
  validate(createSurveySchema),
  createSurvey
);

surveysRouter.get(
  '/:id',
  authorize(['surveys:read']),
  validate(surveyIdSchema, 'params'),
  getSurveyById
);

surveysRouter.put(
  '/:id',
  authorize(['surveys:update']),
  validateMultiple({
    params: surveyIdSchema,
    body: updateSurveySchema
  }),
  updateSurvey
);

surveysRouter.delete(
  '/:id',
  authorize(['surveys:delete']),
  validate(surveyIdSchema, 'params'),
  deleteSurvey
);

surveysRouter.post(
  '/:id/questions',
  authorize(['surveys:manage-questions']),
  validateMultiple({
    params: surveyIdSchema,
    body: createQuestionSchema
  }),
  createQuestion
);

surveysRouter.put(
  '/:id/questions/:questionId',
  authorize(['surveys:manage-questions']),
  validateMultiple({
    params: questionIdSchema,
    body: updateQuestionSchema
  }),
  updateQuestion
);

surveysRouter.delete(
  '/:id/questions/:questionId',
  authorize(['surveys:manage-questions']),
  validate(questionIdSchema, 'params'),
  deleteQuestion
);

surveysRouter.post(
  '/:id/questions/reorder',
  authorize(['surveys:manage-questions']),
  validateMultiple({
    params: surveyIdSchema,
    body: reorderQuestionsSchema
  }),
  reorderQuestions
);

export default surveysRouter;
