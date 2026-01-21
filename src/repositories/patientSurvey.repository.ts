import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  Answer,
  AnswerDTO,
  PatientSurvey,
  PatientSurveyWithDetails
} from '@/types/patientSurvey.types';

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<PatientSurveyWithDetails | null> {
  const client = tx ?? prisma;

  const patientSurvey = await client.patientSurvey.findUnique({
    where: { id },
    select: {
      id: true,
      patientId: true,
      surveyId: true,
      completedBy: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          medicalRecordNumber: true
        }
      },
      survey: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
      user: {
        select: {
          id: true,
          fullName: true
        }
      },
      answers: {
        where: { isActive: true },
        select: {
          id: true,
          patientSurveyId: true,
          questionId: true,
          answer: true,
          comment: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          question: {
            select: {
              id: true,
              text: true,
              order: true,
              requireComment: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  if (!patientSurvey) {
    return null;
  }

  return {
    id: patientSurvey.id,
    patientId: patientSurvey.patientId,
    surveyId: patientSurvey.surveyId,
    completedBy: patientSurvey.completedBy,
    isActive: patientSurvey.isActive,
    createdAt: patientSurvey.createdAt,
    updatedAt: patientSurvey.updatedAt,
    patient: {
      id: patientSurvey.patient.id,
      firstName: patientSurvey.patient.firstName,
      lastName: patientSurvey.patient.lastName,
      medicalRecordNumber: patientSurvey.patient.medicalRecordNumber
    },
    survey: {
      id: patientSurvey.survey.id,
      name: patientSurvey.survey.name,
      description: patientSurvey.survey.description ?? undefined
    },
    completedByUser: {
      id: patientSurvey.user.id,
      fullName: patientSurvey.user.fullName
    },
    answers: patientSurvey.answers.map((answer) => ({
      id: answer.id,
      patientSurveyId: answer.patientSurveyId,
      questionId: answer.questionId,
      answer: answer.answer,
      comment: answer.comment ?? undefined,
      isActive: answer.isActive,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
      question: {
        id: answer.question.id,
        text: answer.question.text,
        order: answer.question.order,
        requireComment: answer.question.requireComment
      }
    }))
  };
}

export async function findAll(
  filters: {
    patientId?: string;
    surveyId?: string;
    isActive?: boolean;
  },
  page: number,
  limit: number,
  tx?: PrismaTransactionClient
): Promise<{ patientSurveys: PatientSurveyWithDetails[]; total: number }> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where = {
    ...(filters.patientId && { patientId: filters.patientId }),
    ...(filters.surveyId && { surveyId: filters.surveyId }),
    ...(filters.isActive !== undefined && { isActive: filters.isActive })
  };

  const [patientSurveys, total] = await Promise.all([
    client.patientSurvey.findMany({
      where,
      select: {
        id: true,
        patientId: true,
        surveyId: true,
        completedBy: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            medicalRecordNumber: true
          }
        },
        survey: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            fullName: true
          }
        },
        answers: {
          where: { isActive: true },
          select: {
            id: true,
            patientSurveyId: true,
            questionId: true,
            answer: true,
            comment: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            question: {
              select: {
                id: true,
                text: true,
                order: true,
                requireComment: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    client.patientSurvey.count({ where })
  ]);

  return {
    patientSurveys: patientSurveys.map((ps) => ({
      id: ps.id,
      patientId: ps.patientId,
      surveyId: ps.surveyId,
      completedBy: ps.completedBy,
      isActive: ps.isActive,
      createdAt: ps.createdAt,
      updatedAt: ps.updatedAt,
      patient: {
        id: ps.patient.id,
        firstName: ps.patient.firstName,
        lastName: ps.patient.lastName,
        medicalRecordNumber: ps.patient.medicalRecordNumber
      },
      survey: {
        id: ps.survey.id,
        name: ps.survey.name,
        description: ps.survey.description ?? undefined
      },
      completedByUser: {
        id: ps.user.id,
        fullName: ps.user.fullName
      },
      answers: ps.answers.map((answer) => ({
        id: answer.id,
        patientSurveyId: answer.patientSurveyId,
        questionId: answer.questionId,
        answer: answer.answer,
        comment: answer.comment ?? undefined,
        isActive: answer.isActive,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        question: {
          id: answer.question.id,
          text: answer.question.text,
          order: answer.question.order,
          requireComment: answer.question.requireComment
        }
      }))
    })),
    total
  };
}

export async function create(
  data: {
    patientId: string;
    surveyId: string;
    completedBy: string;
  },
  tx?: PrismaTransactionClient
): Promise<PatientSurvey> {
  const client = tx ?? prisma;

  return await client.patientSurvey.create({
    data: {
      patientId: data.patientId,
      surveyId: data.surveyId,
      completedBy: data.completedBy
    },
    select: {
      id: true,
      patientId: true,
      surveyId: true,
      completedBy: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function createAnswers(
  patientSurveyId: string,
  answers: AnswerDTO[],
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.answer.createMany({
    data: answers.map((answer) => ({
      patientSurveyId,
      questionId: answer.questionId,
      answer: answer.answer,
      comment: answer.comment ?? null
    }))
  });
}

export async function findExistingSurveyForPatientToday(
  patientId: string,
  surveyId: string,
  tx?: PrismaTransactionClient
): Promise<PatientSurvey | null> {
  const client = tx ?? prisma;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingSurvey = await client.patientSurvey.findFirst({
    where: {
      patientId,
      surveyId,
      createdAt: {
        gte: today,
        lt: tomorrow
      }
    },
    select: {
      id: true,
      patientId: true,
      surveyId: true,
      completedBy: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return existingSurvey;
}

export async function findPreviousActivePatientSurvey(
  patientId: string,
  surveyId: string,
  tx?: PrismaTransactionClient
): Promise<PatientSurvey | null> {
  const client = tx ?? prisma;

  const survey = await client.patientSurvey.findFirst({
    where: {
      patientId,
      surveyId,
      isActive: true
    },
    select: {
      id: true,
      patientId: true,
      surveyId: true,
      completedBy: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return survey;
}

export async function deactivatePatientSurvey(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.patientSurvey.update({
    where: { id },
    data: { isActive: false }
  });
}

export async function getAnswersByPatientSurveyId(
  patientSurveyId: string,
  tx?: PrismaTransactionClient
): Promise<Answer[]> {
  const client = tx ?? prisma;

  const answers = await client.answer.findMany({
    where: {
      patientSurveyId,
      isActive: true
    },
    select: {
      id: true,
      patientSurveyId: true,
      questionId: true,
      answer: true,
      comment: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      question: {
        select: {
          id: true,
          text: true,
          order: true,
          requireComment: true
        }
      }
    }
  });

  return answers.map((answer) => ({
    id: answer.id,
    patientSurveyId: answer.patientSurveyId,
    questionId: answer.questionId,
    answer: answer.answer,
    comment: answer.comment ?? undefined,
    isActive: answer.isActive,
    createdAt: answer.createdAt,
    updatedAt: answer.updatedAt,
    question: {
      id: answer.question.id,
      text: answer.question.text,
      order: answer.question.order,
      requireComment: answer.question.requireComment
    }
  }));
}
