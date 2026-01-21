import type { VitalSigns } from '@prisma/client';

import {
  createNotFoundError,
  createBadRequestError,
  createForbiddenError
} from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import * as appointmentRepository from '@/repositories/appointment.repository';
import * as patientRepository from '@/repositories/patient.repository';
import * as vitalSignsRepository from '@/repositories/vitalSigns.repository';
import * as activityLogService from '@/services/activityLog.service';
import type {
  CreateAppointmentDTO,
  Appointment,
  UpdateAppointmentDTO,
  CancelAppointmentDTO,
  QueryAppointmentsDTO,
  TransitionNotesDTO,
  TransitionToVitalsDTO,
  UpdateVitalSignsDTO
} from '@/types/appointment.types';

export async function createAppointment(
  data: CreateAppointmentDTO,
  createdBy: string
): Promise<Appointment> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que el paciente existe
    const patient = await patientRepository.findById(data.patientId);

    if (!patient) {
      throw createNotFoundError('Paciente no encontrado');
    }

    // Verificar conflicto de horarios para el profesional
    const hasConflict = await appointmentRepository.checkTimeConflict(
      data.userId,
      data.date,
      data.startTime,
      data.endTime,
      undefined,
      tx
    );

    if (hasConflict) {
      throw createBadRequestError(
        'El profesional ya tiene una cita programada en ese horario'
      );
    }

    // Crear la cita
    const appointment = await appointmentRepository.create(data, createdBy, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId: createdBy,
      action: 'APPOINTMENT:CREATE',
      newValue: { appointment },
      tx
    });

    return appointment;
  });
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const appointment = await appointmentRepository.findById(id);

  if (!appointment) {
    throw createNotFoundError('Cita no encontrada');
  }

  return appointment;
}

export async function getAppointments(
  query: QueryAppointmentsDTO
): Promise<{ appointments: Appointment[]; total: number }> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  return await appointmentRepository.findAll(
    {
      patientId: query.patientId,
      userId: query.userId,
      status: query.status,
      date: query.date
    },
    page,
    limit
  );
}

export async function getVitalSignsByAppointmentId(
  id: string
): Promise<VitalSigns> {
  // Verificar que la cita existe
  const appointment = await appointmentRepository.findById(id);

  if (!appointment) {
    throw createNotFoundError('Cita no encontrada');
  }

  const vitalSigns = await vitalSignsRepository.findByAppointmentId(id);

  if (!vitalSigns) {
    throw createNotFoundError(
      'No se encontraron signos vitales para esta cita'
    );
  }

  return vitalSigns;
}

export async function updateVitalSigns(
  id: string,
  data: UpdateVitalSignsDTO,
  userId: string
): Promise<VitalSigns> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que la cita existe
    const appointment = await appointmentRepository.findById(id, tx);

    if (!appointment) {
      throw createNotFoundError('Cita no encontrada');
    }

    // Verificar que existen signos vitales para esta cita
    const existingVitalSigns = await vitalSignsRepository.findByAppointmentId(
      id,
      tx
    );

    if (!existingVitalSigns) {
      throw createNotFoundError(
        'No se encontraron signos vitales para esta cita'
      );
    }

    // Actualizar signos vitales
    const updatedVitalSigns = await vitalSignsRepository.update(id, data, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'VITAL_SIGNS:UPDATE',
      oldValue: existingVitalSigns,
      newValue: updatedVitalSigns,
      tx
    });

    return updatedVitalSigns;
  });
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentDTO,
  userId: string
): Promise<Appointment> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const existing = await appointmentRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Cita no encontrada');
    }

    // Solo se puede editar si está en estado SCHEDULED
    if (existing.status !== 'SCHEDULED') {
      throw createForbiddenError(
        'Solo se pueden editar citas en estado SCHEDULED'
      );
    }

    // Si se está cambiando el paciente, verificar que existe
    if (data.patientId && data.patientId !== existing.patientId) {
      const patient = await patientRepository.findById(data.patientId);

      if (!patient) {
        throw createNotFoundError('Paciente no encontrado');
      }
    }

    // Si se está cambiando la fecha, hora o profesional, verificar conflictos
    const checkUserId = data.userId ?? existing.userId;
    const checkDate = data.date ?? existing.date;
    const checkStartTime = data.startTime ?? existing.startTime;
    const checkEndTime = data.endTime ?? existing.endTime;

    if (data.userId || data.date || data.startTime || data.endTime) {
      const hasConflict = await appointmentRepository.checkTimeConflict(
        checkUserId,
        checkDate,
        checkStartTime,
        checkEndTime,
        id,
        tx
      );

      if (hasConflict) {
        throw createBadRequestError(
          'El profesional ya tiene una cita programada en ese horario'
        );
      }
    }

    // Actualizar la cita
    const appointment = await appointmentRepository.update(id, data, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:UPDATE',
      oldValue: { before: existing },
      newValue: { after: appointment },
      tx
    });

    return appointment;
  });
}

export async function cancelAppointment(
  id: string,
  data: CancelAppointmentDTO,
  userId: string
): Promise<Appointment> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const existing = await appointmentRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Cita no encontrada');
    }

    // Solo se puede cancelar si está en estado SCHEDULED
    if (existing.status !== 'SCHEDULED') {
      throw createForbiddenError(
        'Solo se pueden cancelar citas en estado SCHEDULED'
      );
    }

    // Cancelar la cita
    const appointment = await appointmentRepository.cancel(
      id,
      data.notes ?? existing.notes,
      tx
    );

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:CANCEL',
      oldValue: { before: existing },
      newValue: { after: appointment },
      tx
    });

    return appointment;
  });
}

export async function deleteAppointment(
  id: string,
  userId: string
): Promise<void> {
  return await prisma.$transaction(async (tx) => {
    // Verificar que existe
    const appointment = await appointmentRepository.findById(id, tx);

    if (!appointment) {
      throw createNotFoundError('Cita no encontrada');
    }

    // Eliminar (soft delete)
    await appointmentRepository.remove(id, tx);

    // Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:DELETE',
      oldValue: { appointment },
      tx
    });
  });
}

export async function transitionToVitals(
  id: string,
  data: TransitionToVitalsDTO,
  userId: string
): Promise<Appointment> {
  return await prisma.$transaction(async (tx) => {
    const existing = await appointmentRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Cita no encontrada');
    }

    if (existing.status !== 'SCHEDULED') {
      throw createBadRequestError(
        'Solo se puede tomar signos vitales si la cita está en estado SCHEDULED'
      );
    }

    // Actualizar estado de la cita
    const appointment = await appointmentRepository.updateStatus(
      id,
      'IN_VITALS',
      data.notes,
      { vitalsTakenAt: new Date() },
      tx
    );

    // Crear registro de signos vitales si se proporcionaron datos
    if (
      data.weight ||
      data.height ||
      data.temperature ||
      data.systolicPressure ||
      data.diastolicPressure ||
      data.heartRate ||
      data.respiratoryRate ||
      data.oxygenSaturation
    ) {
      await vitalSignsRepository.create(
        {
          appointmentId: id,
          patientId: existing.patientId,
          recordedById: userId,
          weight: data.weight,
          height: data.height,
          temperature: data.temperature,
          systolicPressure: data.systolicPressure,
          diastolicPressure: data.diastolicPressure,
          heartRate: data.heartRate,
          respiratoryRate: data.respiratoryRate,
          oxygenSaturation: data.oxygenSaturation,
          notes: data.notes
        },
        tx
      );
    }

    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:TRANSITION_TO_VITALS',
      oldValue: { status: existing.status },
      newValue: { status: 'IN_VITALS' },
      tx
    });

    return appointment;
  });
}

export async function transitionToInProgress(
  id: string,
  data: TransitionNotesDTO,
  userId: string
): Promise<Appointment> {
  return await prisma.$transaction(async (tx) => {
    const existing = await appointmentRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Cita no encontrada');
    }

    if (existing.status !== 'IN_VITALS') {
      throw createBadRequestError(
        'Solo se puede iniciar la consulta si la cita está en estado IN_VITALS'
      );
    }

    const appointment = await appointmentRepository.updateStatus(
      id,
      'IN_PROGRESS',
      data.notes,
      { consultationStartedAt: new Date() },
      tx
    );

    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:TRANSITION_TO_IN_PROGRESS',
      oldValue: { status: existing.status },
      newValue: { status: 'IN_PROGRESS' },
      tx
    });

    return appointment;
  });
}

export async function transitionToReady(
  id: string,
  data: TransitionNotesDTO,
  userId: string
): Promise<Appointment> {
  return await prisma.$transaction(async (tx) => {
    const existing = await appointmentRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Cita no encontrada');
    }

    if (existing.status !== 'IN_PROGRESS') {
      throw createBadRequestError(
        'Solo se puede finalizar la consulta si la cita está en estado IN_PROGRESS'
      );
    }

    const appointment = await appointmentRepository.updateStatus(
      id,
      'READY',
      data.notes,
      { consultationEndedAt: new Date() },
      tx
    );

    // TODO: Aquí se debe implementar la descarga del medicamento
    // cuando se integre el módulo de medicamentos con prescripciones

    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:TRANSITION_TO_READY',
      oldValue: { status: existing.status },
      newValue: { status: 'READY', message: 'Receta lista para entrega' },
      tx
    });

    return appointment;
  });
}

export async function transitionToCompleted(
  id: string,
  data: TransitionNotesDTO,
  userId: string
): Promise<Appointment> {
  return await prisma.$transaction(async (tx) => {
    const existing = await appointmentRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Cita no encontrada');
    }

    if (existing.status !== 'READY') {
      throw createBadRequestError(
        'Solo se puede completar la cita si está en estado READY'
      );
    }

    const appointment = await appointmentRepository.updateStatus(
      id,
      'COMPLETED',
      data.notes,
      {},
      tx
    );

    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:TRANSITION_TO_COMPLETED',
      oldValue: { status: existing.status },
      newValue: { status: 'COMPLETED' },
      tx
    });

    return appointment;
  });
}

export async function transitionToNoShow(
  id: string,
  data: TransitionNotesDTO,
  userId: string
): Promise<Appointment> {
  return await prisma.$transaction(async (tx) => {
    const existing = await appointmentRepository.findById(id, tx);

    if (!existing) {
      throw createNotFoundError('Cita no encontrada');
    }

    if (existing.status !== 'SCHEDULED') {
      throw createBadRequestError(
        'Solo se puede marcar como NO_SHOW si la cita está en estado SCHEDULED'
      );
    }

    const appointment = await appointmentRepository.updateStatus(
      id,
      'NO_SHOW',
      data.notes,
      {},
      tx
    );

    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:TRANSITION_TO_NO_SHOW',
      oldValue: { status: existing.status },
      newValue: { status: 'NO_SHOW' },
      tx
    });

    return appointment;
  });
}

export async function getAvailableSlots(
  date: Date,
  userId: string
): Promise<{
  date: Date;
  slots: Array<{ startTime: string; endTime: string; available: boolean }>;
}> {
  // Obtener las citas existentes para ese día y profesional
  const existingAppointments =
    await appointmentRepository.findAppointmentsByDateAndUser(date, userId);

  // Definir horario de trabajo (8:00 AM a 6:00 PM)
  const workStart = 8; // 8 AM
  const workEnd = 18; // 6 PM
  const slotDuration = 30; // 30 minutos por slot

  const slots: Array<{
    startTime: string;
    endTime: string;
    available: boolean;
  }> = [];

  // Generar todos los slots posibles
  for (let hour = workStart; hour < workEnd; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const startHour = hour;
      const startMinute = minute;
      const endMinute = minute + slotDuration;
      const endHour = endMinute >= 60 ? hour + 1 : hour;
      const adjustedEndMinute = endMinute >= 60 ? endMinute - 60 : endMinute;

      // No agregar slot si termina después del horario de trabajo
      if (endHour > workEnd || (endHour === workEnd && adjustedEndMinute > 0)) {
        continue;
      }

      const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(adjustedEndMinute).padStart(2, '0')}`;

      // Verificar si el slot está disponible
      const isAvailable = !existingAppointments.some((apt) => {
        // Hay conflicto si hay solapamiento
        return (
          (startTime >= apt.startTime && startTime < apt.endTime) ||
          (endTime > apt.startTime && endTime <= apt.endTime) ||
          (startTime <= apt.startTime && endTime >= apt.endTime)
        );
      });

      slots.push({
        startTime,
        endTime,
        available: isAvailable
      });
    }
  }

  return {
    date,
    slots
  };
}

export async function getPatientInfoInAppointment(
  appointmentId: string,
  userId: string
): Promise<{
  patient: {
    id: string;
    fullName: string;
    age: number;
    medicalRecordNumber: string;
  };
  allergies: Array<{
    id: string;
    name: string;
    description: string | undefined;
  }>;
  vitalSigns: {
    weight: number | null;
    height: number | null;
    temperature: number | null;
    bloodPressure: string | null;
    heartRate: number | null;
    respiratoryRate: number | null;
    oxygenSaturation: number | null;
    notes: string | null;
  } | null;
  previousAppointments: Array<{
    id: string;
    date: Date;
    attendedBy: string;
    notes: string | null;
  }>;
}> {
  // Verificar que la cita existe y está IN_PROGRESS
  const appointment = await appointmentRepository.findById(appointmentId);

  if (!appointment) {
    throw createNotFoundError('Cita no encontrada');
  }

  if (appointment.status !== 'IN_PROGRESS') {
    throw createBadRequestError(
      'Solo se puede obtener información del paciente en citas que están en progreso'
    );
  }

  // Obtener información del usuario para determinar el área
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      specialty: {
        select: {
          area: true
        }
      }
    }
  });

  if (!user) {
    throw createNotFoundError('Usuario no encontrado');
  }

  const userArea = user.specialty.area;

  // Obtener información básica del paciente
  const patient = await prisma.patient.findUnique({
    where: { id: appointment.patientId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      medicalRecordNumber: true
    }
  });

  if (!patient) {
    throw createNotFoundError('Paciente no encontrado');
  }

  // Calcular edad
  const today = new Date();
  const birthDate = new Date(patient.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Obtener alergias del paciente
  const patientAllergyRepository = await import(
    '@/repositories/patientAllergy.repository'
  );
  const allergies = await patientAllergyRepository.getPatientAllergies(
    appointment.patientId
  );

  // Obtener signos vitales de la cita actual
  let vitalSigns = null;
  const vitalSignsData =
    await vitalSignsRepository.findByAppointmentId(appointmentId);

  if (vitalSignsData) {
    vitalSigns = {
      weight: vitalSignsData.weight,
      height: vitalSignsData.height,
      temperature: vitalSignsData.temperature,
      bloodPressure:
        vitalSignsData.systolicPressure && vitalSignsData.diastolicPressure
          ? `${vitalSignsData.systolicPressure}/${vitalSignsData.diastolicPressure}`
          : null,
      heartRate: vitalSignsData.heartRate,
      respiratoryRate: vitalSignsData.respiratoryRate,
      oxygenSaturation: vitalSignsData.oxygenSaturation,
      notes: vitalSignsData.notes
    };
  }

  // Obtener las últimas 8 citas del paciente según el área
  const previousAppointmentsData = await prisma.appointment.findMany({
    where: {
      patientId: appointment.patientId,
      id: { not: appointmentId },
      isActive: true,
      deletedAt: null,
      status: 'COMPLETED',
      user: {
        specialty: {
          area: userArea
        }
      }
    },
    select: {
      id: true,
      date: true,
      notes: true,
      user: {
        select: {
          fullName: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    },
    take: 8
  });

  const previousAppointments = previousAppointmentsData.map((apt) => ({
    id: apt.id,
    date: apt.date,
    attendedBy: apt.user.fullName,
    notes: apt.notes
  }));

  return {
    patient: {
      id: patient.id,
      fullName: `${patient.firstName} ${patient.lastName}`,
      age,
      medicalRecordNumber: patient.medicalRecordNumber
    },
    allergies: allergies.map((allergy) => ({
      id: allergy.id,
      name: allergy.allergyName,
      description: allergy.allergyDescription ?? undefined
    })),
    vitalSigns,
    previousAppointments
  };
}

export async function completeDentalConsultation(
  appointmentId: string,
  data: {
    dentalHistory: {
      chiefComplaint?: string | null;
      diagnosis?: string | null;
      oralHygieneLevel?: string;
      gumCondition?: string;
      hasCalculus?: boolean;
      hasPlaque?: boolean;
      hasHalitosis?: boolean;
      treatmentPlan?: string | null;
      nextVisitDate?: Date | null;
      recommendations?: string | null;
      teeth?: Array<{
        toothNumber: number;
        position: string;
        quadrant?: number | null;
        affectedSurfaces?: string | null;
        condition?: string;
        notes?: string | null;
      }>;
    };
    prescription?: {
      generalInstructions?: string | null;
      dietRecommendations?: string | null;
      restrictions?: string | null;
      validUntil?: Date | null;
      items: Array<{
        medicationId: string;
        quantity: number;
        dosage: string;
        frequency: string;
        duration: string;
        administration: string;
        instructions?: string | null;
      }>;
    };
  },
  userId: string
): Promise<{
  appointment: Appointment;
  dentalHistory: {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentId: string;
    chiefComplaint?: string;
    diagnosis?: string;
    oralHygieneLevel: string;
    gumCondition: string;
    hasCalculus: boolean;
    hasPlaque: boolean;
    hasHalitosis: boolean;
    treatmentPlan?: string;
    nextVisitDate?: Date;
    recommendations?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  odontogram?: {
    id: string;
    dentalHistoryId: string;
    teeth: Array<{
      id: string;
      toothNumber: number;
      position: string;
      quadrant?: number;
      affectedSurfaces?: string;
      condition: string;
      notes?: string;
    }>;
  };
  prescription?: {
    id: string;
    prescriptionNumber: string;
    patientId: string;
    doctorId: string;
    generalInstructions?: string;
    dietRecommendations?: string;
    restrictions?: string;
    validUntil?: Date;
    items: Array<{
      id: string;
      medicationId: string;
      medicationName: string;
      quantity: number;
      dosage: string;
      frequency: string;
      duration: string;
      administration: string;
      instructions?: string;
    }>;
  };
}> {
  return await prisma.$transaction(async (tx) => {
    // 1. Verificar que la cita existe y está en estado IN_PROGRESS
    const appointment = await appointmentRepository.findById(appointmentId, tx);

    if (!appointment) {
      throw createNotFoundError('Cita no encontrada');
    }

    if (appointment.status !== 'IN_PROGRESS') {
      throw createBadRequestError(
        'Solo se puede completar la consulta si la cita está en estado IN_PROGRESS'
      );
    }

    // 2. Crear el historial dental con odontograma
    const dentalHistoryData = {
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      ...data.dentalHistory
    };

    const dentalHistory = await tx.dentalHistory.create({
      data: {
        patientId: dentalHistoryData.patientId,
        doctorId: userId,
        appointmentId: dentalHistoryData.appointmentId,
        chiefComplaint: dentalHistoryData.chiefComplaint ?? null,
        diagnosis: dentalHistoryData.diagnosis ?? null,
        oralHygieneLevel:
          (dentalHistoryData.oralHygieneLevel as
            | 'EXCELLENT'
            | 'GOOD'
            | 'FAIR'
            | 'POOR') ?? 'FAIR',
        gumCondition:
          (dentalHistoryData.gumCondition as
            | 'HEALTHY'
            | 'GINGIVITIS'
            | 'PERIODONTITIS'
            | 'BLEEDING'
            | 'INFLAMMATION') ?? 'HEALTHY',
        hasCalculus: dentalHistoryData.hasCalculus ?? false,
        hasPlaque: dentalHistoryData.hasPlaque ?? false,
        hasHalitosis: dentalHistoryData.hasHalitosis ?? false,
        treatmentPlan: dentalHistoryData.treatmentPlan ?? null,
        nextVisitDate: dentalHistoryData.nextVisitDate ?? null,
        recommendations: dentalHistoryData.recommendations ?? null
      }
    });

    // 3. Crear odontograma si hay datos de dientes
    let odontogram = null;

    if (dentalHistoryData.teeth && dentalHistoryData.teeth.length > 0) {
      odontogram = await tx.odontogram.create({
        data: {
          dentalHistoryId: dentalHistory.id,
          teeth: {
            create: dentalHistoryData.teeth.map((tooth) => ({
              toothNumber: tooth.toothNumber,
              position: tooth.position,
              quadrant: tooth.quadrant ?? null,
              affectedSurfaces: tooth.affectedSurfaces ?? null,
              condition:
                (tooth.condition as
                  | 'HEALTHY'
                  | 'CARIES'
                  | 'FILLED'
                  | 'FRACTURED'
                  | 'MISSING'
                  | 'CROWN'
                  | 'BRIDGE'
                  | 'IMPLANT'
                  | 'ROOT_CANAL'
                  | 'EXTRACTION_NEEDED'
                  | 'WISDOM_TOOTH') ?? 'HEALTHY',
              notes: tooth.notes ?? null
            }))
          }
        },
        include: {
          teeth: true
        }
      });
    }

    // 4. Crear receta si se proporciona
    let prescription = null;

    if (data.prescription && data.prescription.items.length > 0) {
      // Verificar stock de medicamentos
      for (const item of data.prescription.items) {
        const medication = await tx.medication.findFirst({
          where: {
            id: item.medicationId,
            isActive: true,
            deletedAt: null
          }
        });

        if (!medication) {
          throw createNotFoundError(
            `Medicamento con ID ${item.medicationId} no encontrado`
          );
        }

        if (medication.stock < item.quantity) {
          throw createBadRequestError(
            `Stock insuficiente para ${medication.name}. Stock disponible: ${medication.stock}, solicitado: ${item.quantity}`
          );
        }
      }

      // Generar número de receta
      const year = new Date().getFullYear();
      const lastPrescription = await tx.prescription.findFirst({
        where: {
          prescriptionNumber: {
            startsWith: `RX-${year}-`
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          prescriptionNumber: true
        }
      });

      let prescriptionNumber: string;

      if (lastPrescription) {
        const lastNumber = parseInt(
          lastPrescription.prescriptionNumber.split('-')[2]
        );

        prescriptionNumber = `RX-${year}-${String(lastNumber + 1).padStart(4, '0')}`;
      } else {
        prescriptionNumber = `RX-${year}-0001`;
      }

      // Crear la receta
      prescription = await tx.prescription.create({
        data: {
          medicalHistoryId: null,
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          doctorId: userId,
          prescriptionNumber,
          generalInstructions: data.prescription.generalInstructions ?? null,
          dietRecommendations: data.prescription.dietRecommendations ?? null,
          restrictions: data.prescription.restrictions ?? null,
          validUntil: data.prescription.validUntil ?? null,
          prescriptionItems: {
            create: data.prescription.items.map((item) => ({
              medicationId: item.medicationId,
              quantity: item.quantity,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              administration: item.administration,
              instructions: item.instructions ?? null
            }))
          }
        },
        include: {
          prescriptionItems: {
            include: {
              medication: {
                select: {
                  name: true,
                  measureUnit: true
                }
              }
            }
          }
        }
      });

      // Descargar medicamentos del inventario
      for (const item of prescription.prescriptionItems) {
        await tx.medication.update({
          where: {
            id: item.medicationId
          },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
    }

    // 5. Cambiar estado de la cita a READY
    const updatedAppointment = await appointmentRepository.updateStatus(
      appointmentId,
      'READY',
      'Consulta dental finalizada',
      { consultationEndedAt: new Date() },
      tx
    );

    // 6. Registrar actividad
    await activityLogService.logActivity({
      userId,
      action: 'APPOINTMENT:COMPLETE_DENTAL_CONSULTATION',
      oldValue: { status: 'IN_PROGRESS' },
      newValue: {
        status: 'READY',
        dentalHistoryId: dentalHistory.id,
        prescriptionId: prescription?.id,
        message: 'Consulta dental completada con éxito'
      },
      tx
    });

    return {
      appointment: updatedAppointment,
      dentalHistory: {
        id: dentalHistory.id,
        patientId: dentalHistory.patientId,
        doctorId: dentalHistory.doctorId,
        appointmentId: dentalHistory.appointmentId,
        chiefComplaint: dentalHistory.chiefComplaint ?? undefined,
        diagnosis: dentalHistory.diagnosis ?? undefined,
        oralHygieneLevel: dentalHistory.oralHygieneLevel,
        gumCondition: dentalHistory.gumCondition,
        hasCalculus: dentalHistory.hasCalculus,
        hasPlaque: dentalHistory.hasPlaque,
        hasHalitosis: dentalHistory.hasHalitosis,
        treatmentPlan: dentalHistory.treatmentPlan ?? undefined,
        nextVisitDate: dentalHistory.nextVisitDate ?? undefined,
        recommendations: dentalHistory.recommendations ?? undefined,
        createdAt: dentalHistory.createdAt,
        updatedAt: dentalHistory.updatedAt
      },
      odontogram: odontogram
        ? {
            id: odontogram.id,
            dentalHistoryId: odontogram.dentalHistoryId,
            teeth: odontogram.teeth.map((tooth) => ({
              id: tooth.id,
              toothNumber: tooth.toothNumber,
              position: tooth.position,
              quadrant: tooth.quadrant ?? undefined,
              affectedSurfaces: tooth.affectedSurfaces ?? undefined,
              condition: tooth.condition,
              notes: tooth.notes ?? undefined
            }))
          }
        : undefined,
      prescription: prescription
        ? {
            id: prescription.id,
            prescriptionNumber: prescription.prescriptionNumber,
            patientId: prescription.patientId,
            doctorId: prescription.doctorId,
            generalInstructions: prescription.generalInstructions ?? undefined,
            dietRecommendations: prescription.dietRecommendations ?? undefined,
            restrictions: prescription.restrictions ?? undefined,
            validUntil: prescription.validUntil ?? undefined,
            items: prescription.prescriptionItems.map((item) => ({
              id: item.id,
              medicationId: item.medicationId,
              medicationName: item.medication.name,
              quantity: item.quantity,
              dosage: item.dosage,
              frequency: item.frequency,
              duration: item.duration,
              administration: item.administration,
              instructions: item.instructions ?? undefined
            }))
          }
        : undefined
    };
  });
}
