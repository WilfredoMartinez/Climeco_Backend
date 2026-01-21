import type { Prisma } from '@prisma/client';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  PaginatedSurveys,
  Question,
  Survey,
  SurveyWithQuestions
} from '@/types/survey.types';

export async function findSurveyByName(
  name: string,
  tx?: PrismaTransactionClient
): Promise<Survey | null> {
  const client = tx ?? prisma;

  return await client.survey.findUnique({
    where: { name },
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function findSurveyById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<SurveyWithQuestions | null> {
  const client = tx ?? prisma;

  const survey = await client.survey.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      questions: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: {
          id: true,
          surveyId: true,
          order: true,
          text: true,
          requireComment: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  });

  if (!survey) return null;

  return {
    ...survey,
    questions: survey.questions
  };
}

export async function findAllSurveys(
  page: number,
  limit: number,
  search?: string,
  tx?: PrismaTransactionClient
): Promise<PaginatedSurveys> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where: Prisma.SurveyWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [surveys, total] = await Promise.all([
    client.survey.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        questions: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          select: {
            id: true,
            surveyId: true,
            order: true,
            text: true,
            requireComment: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    }),
    client.survey.count({ where })
  ]);

  return {
    data: surveys,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function createSurvey(
  data: {
    name: string;
    description?: string;
  },
  tx?: PrismaTransactionClient
): Promise<Survey> {
  const client = tx ?? prisma;

  return await client.survey.create({
    data,
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function updateSurvey(
  id: string,
  data: {
    name?: string;
    description?: string;
  },
  tx?: PrismaTransactionClient
): Promise<Survey> {
  const client = tx ?? prisma;

  return await client.survey.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function deleteSurvey(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.survey.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}

export async function createQuestion(
  surveyId: string,
  data: {
    text: string;
    requireComment: boolean;
    order: string;
  },
  tx?: PrismaTransactionClient
): Promise<Question> {
  const client = tx ?? prisma;

  return await client.question.create({
    data: {
      surveyId,
      text: data.text,
      requireComment: data.requireComment,
      order: data.order
    },
    select: {
      id: true,
      surveyId: true,
      order: true,
      text: true,
      requireComment: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function createManyQuestions(
  surveyId: string,
  questions: Array<{
    text: string;
    requireComment: boolean;
    order: string;
  }>,
  tx?: PrismaTransactionClient
): Promise<number> {
  const client = tx ?? prisma;

  const result = await client.question.createMany({
    data: questions.map((q) => ({
      surveyId,
      text: q.text,
      requireComment: q.requireComment,
      order: q.order
    }))
  });

  return result.count;
}

export async function findQuestionById(
  questionId: string,
  tx?: PrismaTransactionClient
): Promise<Question | null> {
  const client = tx ?? prisma;

  return await client.question.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      surveyId: true,
      order: true,
      text: true,
      requireComment: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function updateQuestion(
  questionId: string,
  data: {
    text?: string;
    requireComment?: boolean;
    order?: string;
    isActive?: boolean;
  },
  tx?: PrismaTransactionClient
): Promise<Question> {
  const client = tx ?? prisma;

  return await client.question.update({
    where: { id: questionId },
    data: {
      ...(data.text !== undefined && { text: data.text }),
      ...(data.requireComment !== undefined && {
        requireComment: data.requireComment
      }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.isActive !== undefined && { isActive: data.isActive })
    },
    select: {
      id: true,
      surveyId: true,
      order: true,
      text: true,
      requireComment: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function deleteQuestion(
  questionId: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.question.update({
    where: { id: questionId },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}

export async function countQuestionsBySurvey(
  surveyId: string,
  tx?: PrismaTransactionClient
): Promise<number> {
  const client = tx ?? prisma;

  return await client.question.count({
    where: {
      surveyId,
      isActive: true
    }
  });
}

export async function getQuestionsBySurveyId(
  surveyId: string,
  tx?: PrismaTransactionClient
): Promise<Question[]> {
  const client = tx ?? prisma;

  return await client.question.findMany({
    where: {
      surveyId,
      isActive: true
    },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      surveyId: true,
      order: true,
      text: true,
      requireComment: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function updateQuestionOrders(
  updates: Array<{ id: string; order: string }>,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await Promise.all(
    updates.map((update) =>
      client.question.update({
        where: { id: update.id },
        data: { order: update.order }
      })
    )
  );
}
