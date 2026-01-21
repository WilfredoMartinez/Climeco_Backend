import type { Prisma } from '@prisma/client';
import { format } from 'date-fns';

import { prisma, type PrismaTransactionClient } from '@/lib/prisma';
import type {
  CreateAppointmentDTO,
  Appointment,
  UpdateAppointmentDTO,
  AppointmentStatus
} from '@/types/appointment.types';

export async function create(
  data: CreateAppointmentDTO,
  createdBy: string,
  tx?: PrismaTransactionClient
): Promise<Appointment> {
  const client = tx ?? prisma;

  const appointment = await client.appointment.create({
    data: {
      patientId: data.patientId,
      userId: data.userId,
      date: data.date,
      startTime: new Date(`2000-01-01T${data.startTime}:00`),
      endTime: new Date(`2000-01-01T${data.endTime}:00`),
      duration: data.duration,
      status: data.status ?? 'SCHEDULED',
      notes: data.notes ?? null,
      createdBy
    },
    select: {
      id: true,
      patientId: true,
      userId: true,
      date: true,
      startTime: true,
      endTime: true,
      duration: true,
      status: true,
      notes: true,
      createdBy: true,
      createdAt: true,
      patient: {
        select: {
          firstName: true,
          lastName: true,
          documentNumber: true,
          medicalRecordNumber: true
        }
      },
      user: {
        select: {
          fullName: true
        }
      }
    }
  });

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    userId: appointment.userId,
    date: appointment.date,
    startTime: format(appointment.startTime, 'HH:mm'),
    endTime: format(appointment.endTime, 'HH:mm'),
    duration: appointment.duration,
    status: appointment.status as AppointmentStatus,
    notes: appointment.notes ?? undefined,
    createdBy: appointment.createdBy,
    createdAt: appointment.createdAt,
    patient: {
      firstName: appointment.patient.firstName,
      lastName: appointment.patient.lastName,
      documentNumber: appointment.patient.documentNumber,
      medicalRecordNumber: appointment.patient.medicalRecordNumber
    },
    user: {
      fullName: appointment.user.fullName
    }
  };
}

export async function findById(
  id: string,
  tx?: PrismaTransactionClient
): Promise<Appointment | null> {
  const client = tx ?? prisma;

  const appointment = await client.appointment.findFirst({
    where: {
      id,
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      patientId: true,
      userId: true,
      date: true,
      startTime: true,
      endTime: true,
      duration: true,
      status: true,
      notes: true,
      createdBy: true,
      createdAt: true,
      patient: {
        select: {
          firstName: true,
          lastName: true,
          documentNumber: true,
          medicalRecordNumber: true
        }
      },
      user: {
        select: {
          fullName: true
        }
      }
    }
  });

  if (!appointment) return null;

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    userId: appointment.userId,
    date: appointment.date,
    startTime: format(appointment.startTime, 'HH:mm'),
    endTime: format(appointment.endTime, 'HH:mm'),
    duration: appointment.duration,
    status: appointment.status as AppointmentStatus,
    notes: appointment.notes ?? undefined,
    createdBy: appointment.createdBy,
    createdAt: appointment.createdAt,
    patient: {
      firstName: appointment.patient.firstName,
      lastName: appointment.patient.lastName,
      documentNumber: appointment.patient.documentNumber,
      medicalRecordNumber: appointment.patient.medicalRecordNumber
    },
    user: {
      fullName: appointment.user.fullName
    }
  };
}

export async function findAll(
  filters: {
    patientId: string | undefined;
    userId: string | undefined;
    status: AppointmentStatus | undefined;
    date: Date | undefined;
  },
  page: number,
  limit: number,
  tx?: PrismaTransactionClient
): Promise<{ appointments: Appointment[]; total: number }> {
  const client = tx ?? prisma;
  const skip = (page - 1) * limit;

  const where: Prisma.AppointmentWhereInput = {
    isActive: true,
    deletedAt: null
  };

  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.date) {
    where.date = filters.date;
  }

  const [data, total] = await Promise.all([
    client.appointment.findMany({
      where,
      select: {
        id: true,
        patientId: true,
        userId: true,
        date: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        notes: true,
        createdBy: true,
        createdAt: true,
        patient: {
          select: {
            firstName: true,
            lastName: true,
            documentNumber: true,
            medicalRecordNumber: true
          }
        },
        user: {
          select: {
            fullName: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    }),
    client.appointment.count({ where })
  ]);

  const appointments = data.map((appointment) => ({
    id: appointment.id,
    patientId: appointment.patientId,
    userId: appointment.userId,
    date: appointment.date,
    startTime: format(appointment.startTime, 'HH:mm'),
    endTime: format(appointment.endTime, 'HH:mm'),
    duration: appointment.duration,
    status: appointment.status as AppointmentStatus,
    notes: appointment.notes ?? undefined,
    createdBy: appointment.createdBy,
    createdAt: appointment.createdAt,
    patient: {
      firstName: appointment.patient.firstName,
      lastName: appointment.patient.lastName,
      documentNumber: appointment.patient.documentNumber,
      medicalRecordNumber: appointment.patient.medicalRecordNumber
    },
    user: {
      fullName: appointment.user.fullName
    }
  }));

  return { appointments, total };
}

export async function update(
  id: string,
  data: UpdateAppointmentDTO,
  tx?: PrismaTransactionClient
): Promise<Appointment> {
  const client = tx ?? prisma;

  const updateData: Prisma.AppointmentUpdateInput = {};

  if (data.patientId !== undefined) {
    updateData.patient = {
      connect: { id: data.patientId }
    };
  }

  if (data.userId !== undefined) {
    updateData.user = {
      connect: { id: data.userId }
    };
  }

  if (data.date !== undefined) {
    updateData.date = data.date;
  }

  if (data.startTime !== undefined) {
    updateData.startTime = new Date(`2000-01-01T${data.startTime}:00`);
  }

  if (data.endTime !== undefined) {
    updateData.endTime = new Date(`2000-01-01T${data.endTime}:00`);
  }

  if (data.duration !== undefined) {
    updateData.duration = data.duration;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.notes !== undefined) {
    updateData.notes = data.notes;
  }

  const appointment = await client.appointment.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      patientId: true,
      userId: true,
      date: true,
      startTime: true,
      endTime: true,
      duration: true,
      status: true,
      notes: true,
      createdBy: true,
      createdAt: true,
      patient: {
        select: {
          firstName: true,
          lastName: true,
          documentNumber: true,
          medicalRecordNumber: true
        }
      },
      user: {
        select: {
          fullName: true
        }
      }
    }
  });

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    userId: appointment.userId,
    date: appointment.date,
    startTime: format(appointment.startTime, 'HH:mm'),
    endTime: format(appointment.endTime, 'HH:mm'),
    duration: appointment.duration,
    status: appointment.status as AppointmentStatus,
    notes: appointment.notes ?? undefined,
    createdBy: appointment.createdBy,
    createdAt: appointment.createdAt,
    patient: {
      firstName: appointment.patient.firstName,
      lastName: appointment.patient.lastName,
      documentNumber: appointment.patient.documentNumber,
      medicalRecordNumber: appointment.patient.medicalRecordNumber
    },
    user: {
      fullName: appointment.user.fullName
    }
  };
}

export async function cancel(
  id: string,
  notes: string | undefined,
  tx?: PrismaTransactionClient
): Promise<Appointment> {
  const client = tx ?? prisma;

  const appointment = await client.appointment.update({
    where: { id },
    data: {
      status: 'CANCELED',
      notes
    },
    select: {
      id: true,
      patientId: true,
      userId: true,
      date: true,
      startTime: true,
      endTime: true,
      duration: true,
      status: true,
      notes: true,
      createdBy: true,
      createdAt: true,
      patient: {
        select: {
          firstName: true,
          lastName: true,
          documentNumber: true,
          medicalRecordNumber: true
        }
      },
      user: {
        select: {
          fullName: true
        }
      }
    }
  });

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    userId: appointment.userId,
    date: appointment.date,
    startTime: format(appointment.startTime, 'HH:mm'),
    endTime: format(appointment.endTime, 'HH:mm'),
    duration: appointment.duration,
    status: appointment.status as AppointmentStatus,
    notes: appointment.notes ?? undefined,
    createdBy: appointment.createdBy,
    createdAt: appointment.createdAt,
    patient: {
      firstName: appointment.patient.firstName,
      lastName: appointment.patient.lastName,
      documentNumber: appointment.patient.documentNumber,
      medicalRecordNumber: appointment.patient.medicalRecordNumber
    },
    user: {
      fullName: appointment.user.fullName
    }
  };
}

export async function updateStatus(
  id: string,
  status: AppointmentStatus,
  notes: string | null | undefined,
  timestamps: {
    vitalsTakenAt?: Date;
    consultationStartedAt?: Date;
    consultationEndedAt?: Date;
  },
  tx?: PrismaTransactionClient
): Promise<Appointment> {
  const client = tx ?? prisma;

  const updateData: Prisma.AppointmentUpdateInput = {
    status
  };

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  if (timestamps.vitalsTakenAt) {
    updateData.vitalsTakenAt = timestamps.vitalsTakenAt;
  }

  if (timestamps.consultationStartedAt) {
    updateData.consultationStartedAt = timestamps.consultationStartedAt;
  }

  if (timestamps.consultationEndedAt) {
    updateData.consultationEndedAt = timestamps.consultationEndedAt;
  }

  const appointment = await client.appointment.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      patientId: true,
      userId: true,
      date: true,
      startTime: true,
      endTime: true,
      duration: true,
      status: true,
      notes: true,
      createdBy: true,
      createdAt: true,
      patient: {
        select: {
          firstName: true,
          lastName: true,
          documentNumber: true,
          medicalRecordNumber: true
        }
      },
      user: {
        select: {
          fullName: true
        }
      }
    }
  });

  return {
    id: appointment.id,
    patientId: appointment.patientId,
    userId: appointment.userId,
    date: appointment.date,
    startTime: format(appointment.startTime, 'HH:mm'),
    endTime: format(appointment.endTime, 'HH:mm'),
    duration: appointment.duration,
    status: appointment.status as AppointmentStatus,
    notes: appointment.notes ?? undefined,
    createdBy: appointment.createdBy,
    createdAt: appointment.createdAt,
    patient: {
      firstName: appointment.patient.firstName,
      lastName: appointment.patient.lastName,
      documentNumber: appointment.patient.documentNumber,
      medicalRecordNumber: appointment.patient.medicalRecordNumber
    },
    user: {
      fullName: appointment.user.fullName
    }
  };
}

export async function remove(
  id: string,
  tx?: PrismaTransactionClient
): Promise<void> {
  const client = tx ?? prisma;

  await client.appointment.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}

export async function checkTimeConflict(
  userId: string,
  date: Date,
  startTime: string,
  endTime: string,
  excludeAppointmentId?: string,
  tx?: PrismaTransactionClient
): Promise<boolean> {
  const client = tx ?? prisma;

  const where: Prisma.AppointmentWhereInput = {
    userId,
    date,
    isActive: true,
    deletedAt: null,
    status: {
      in: ['SCHEDULED', 'IN_VITALS', 'IN_PROGRESS']
    }
  };

  if (excludeAppointmentId) {
    where.id = { not: excludeAppointmentId };
  }

  const existingAppointments = await client.appointment.findMany({
    where,
    select: {
      startTime: true,
      endTime: true
    }
  });

  const newStart = new Date(`2000-01-01T${startTime}:00`);
  const newEnd = new Date(`2000-01-01T${endTime}:00`);

  for (const existing of existingAppointments) {
    const existingStart = existing.startTime;
    const existingEnd = existing.endTime;

    const hasConflict =
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd);

    if (hasConflict) {
      return true;
    }
  }

  return false;
}

export async function findAppointmentsByDateAndUser(
  date: Date,
  userId: string,
  tx?: PrismaTransactionClient
): Promise<Array<{ startTime: string; endTime: string }>> {
  const client = tx ?? prisma;

  const appointments = await client.appointment.findMany({
    where: {
      userId,
      date,
      isActive: true,
      deletedAt: null,
      status: {
        notIn: ['CANCELED', 'NO_SHOW']
      }
    },
    select: {
      startTime: true,
      endTime: true
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  return appointments.map((apt) => ({
    startTime: format(apt.startTime, 'HH:mm'),
    endTime: format(apt.endTime, 'HH:mm')
  }));
}
