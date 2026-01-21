import { createNotFoundError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';

interface HistoryRecord {
  id: string;
  visitDate: Date;
  professionalName: string;
  observations: string | null;
}

export async function getPatientHistoryByArea(
  patientId: string,
  area: 'MEDICINA_GENERAL' | 'ODONTOLOGIA'
): Promise<HistoryRecord[]> {
  // Verificar que el paciente existe
  const patient = await prisma.patient.findUnique({
    where: { id: patientId }
  });

  if (!patient) {
    throw createNotFoundError('Paciente no encontrado');
  }

  if (area === 'ODONTOLOGIA') {
    // Obtener historiales dentales con odontograma
    const dentalHistories = await prisma.dentalHistory.findMany({
      where: {
        patientId,
        isActive: true
      },
      include: {
        doctor: {
          select: {
            fullName: true
          }
        },
        odontogram: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return dentalHistories.map((history) => ({
      id: history.id,
      visitDate: history.createdAt,
      professionalName: history.doctor.fullName,
      observations:
        history.recommendations ||
        history.diagnosis ||
        history.chiefComplaint ||
        null
    }));
  } else {
    // Obtener historiales médicos
    const medicalHistories = await prisma.medicalHistory.findMany({
      where: {
        patientId,
        isActive: true
      },
      include: {
        doctor: {
          select: {
            fullName: true
          }
        }
      },
      orderBy: {
        visitDate: 'desc'
      }
    });

    return medicalHistories.map((history) => ({
      id: history.id,
      visitDate: history.visitDate,
      professionalName: history.doctor.fullName,
      observations:
        history.followUpNotes ||
        history.diagnosis ||
        history.chiefComplaint ||
        null
    }));
  }
}
