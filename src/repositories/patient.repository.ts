import { prisma } from '@/lib/prisma';
import type {
  CreatePatientDTO,
  Patient,
  UpdatePatientDTO
} from '@/types/patient.types';

async function generateUniqueMedicalRecordNumber(): Promise<string> {
  let medicalRecordNumber: string;
  let exists = true;

  while (exists) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const random = Math.floor(10000 + Math.random() * 90000);

    medicalRecordNumber = `MRN-${year}${month}${day}-${random}`;

    const existing = await prisma.patient.findFirst({
      where: { medicalRecordNumber }
    });

    exists = !!existing;
  }

  return medicalRecordNumber!;
}

export async function findByDocumentNumber(
  documentNumber: string
): Promise<Patient | null> {
  const patient = await prisma.patient.findFirst({
    where: {
      documentNumber,
      isActive: true,
      deletedAt: null
    }
  });

  if (!patient) return null;

  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    fullName: patient.firstName + ' ' + patient.lastName,
    documentType: patient.documentType,
    documentNumber: patient.documentNumber,
    birthDate: patient.dateOfBirth,
    isMinor: patient.isMinor,
    guardianName: patient.guardianName ?? undefined,
    gender: patient.gender,
    email: patient.email ?? undefined,
    phone: patient.phone ?? undefined,
    address: patient.address ?? undefined,
    consentMechanism: patient.consentMechanism,
    consentAcceptedAt: patient.consentAcceptedAt,
    medicalRecordNumber: patient.medicalRecordNumber,
    createdAt: patient.createdAt
  };
}

export async function create(data: CreatePatientDTO): Promise<Patient> {
  const newPatient = await prisma.patient.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      dateOfBirth: data.dateOfBirth,
      isMinor: data.isMinor,
      guardianName: data.guardianName ?? null,
      gender: data.gender,
      email: data.email ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      consentMechanism: data.consentMechanism,
      consentAcceptedAt: data.consentAcceptedAt,
      medicalRecordNumber:
        data.medicalRecordNumber ?? (await generateUniqueMedicalRecordNumber())
    }
  });

  return {
    id: newPatient.id,
    firstName: newPatient.firstName,
    lastName: newPatient.lastName,
    fullName: newPatient.firstName + ' ' + newPatient.lastName,
    documentType: newPatient.documentType,
    documentNumber: newPatient.documentNumber,
    birthDate: newPatient.dateOfBirth,
    isMinor: newPatient.isMinor,
    guardianName: newPatient.guardianName ?? undefined,
    gender: newPatient.gender,
    email: newPatient.email ?? undefined,
    phone: newPatient.phone ?? undefined,
    address: newPatient.address ?? undefined,
    consentMechanism: newPatient.consentMechanism,
    consentAcceptedAt: newPatient.consentAcceptedAt,
    medicalRecordNumber: newPatient.medicalRecordNumber,
    createdAt: newPatient.createdAt
  };
}

export async function findById(patientId: string): Promise<Patient | null> {
  const patient = await prisma.patient.findFirst({
    where: {
      id: patientId,
      isActive: true,
      deletedAt: null
    }
  });

  if (!patient) return null;

  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    fullName: patient.firstName + ' ' + patient.lastName,
    documentType: patient.documentType,
    documentNumber: patient.documentNumber,
    birthDate: patient.dateOfBirth,
    isMinor: patient.isMinor,
    guardianName: patient.guardianName ?? undefined,
    gender: patient.gender,
    email: patient.email ?? undefined,
    phone: patient.phone ?? undefined,
    address: patient.address ?? undefined,
    consentMechanism: patient.consentMechanism,
    consentAcceptedAt: patient.consentAcceptedAt,
    medicalRecordNumber: patient.medicalRecordNumber,
    createdAt: patient.createdAt
  };
}

export async function update(
  patientId: string,
  data: UpdatePatientDTO
): Promise<Patient> {
  const updatedPatient = await prisma.patient.update({
    where: { id: patientId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      dateOfBirth: data.dateOfBirth,
      isMinor: data.isMinor,
      guardianName: data.guardianName,
      gender: data.gender,
      email: data.email,
      phone: data.phone,
      address: data.address,
      consentMechanism: data.consentMechanism
    }
  });

  return {
    id: updatedPatient.id,
    firstName: updatedPatient.firstName,
    lastName: updatedPatient.lastName,
    fullName: updatedPatient.firstName + ' ' + updatedPatient.lastName,
    documentType: updatedPatient.documentType,
    documentNumber: updatedPatient.documentNumber,
    birthDate: updatedPatient.dateOfBirth,
    isMinor: updatedPatient.isMinor,
    guardianName: updatedPatient.guardianName ?? undefined,
    gender: updatedPatient.gender,
    email: updatedPatient.email ?? undefined,
    phone: updatedPatient.phone ?? undefined,
    address: updatedPatient.address ?? undefined,
    consentMechanism: updatedPatient.consentMechanism,
    consentAcceptedAt: updatedPatient.consentAcceptedAt,
    medicalRecordNumber: updatedPatient.medicalRecordNumber,
    createdAt: updatedPatient.createdAt
  };
}

export async function deleteById(patientId: string): Promise<void> {
  await prisma.patient.update({
    where: { id: patientId },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  });
}

export async function findAll(params: {
  page: number;
  limit: number;
  search?: string;
  searchBy: 'name' | 'documentNumber' | 'medicalRecordNumber';
}): Promise<{
  patients: Patient[];
  total: number;
}> {
  const { page, limit, search, searchBy } = params;
  const skip = (page - 1) * limit;

  // Para búsquedas con datos encriptados, necesitamos una estrategia diferente
  // Si hay búsqueda por nombre, traemos más registros y filtramos en memoria
  if (search && searchBy === 'name') {
    // Traer pacientes activos
    const allPatients = await prisma.patient.findMany({
      where: {
        isActive: true,
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filtrar en memoria después de desencriptar (Prisma extension lo hace automáticamente)
    const searchLower = search.toLowerCase();
    const filteredPatients = allPatients.filter((patient) => {
      const firstNameMatch = patient.firstName
        .toLowerCase()
        .includes(searchLower);
      const lastNameMatch = patient.lastName
        .toLowerCase()
        .includes(searchLower);

      return firstNameMatch || lastNameMatch;
    });

    const total = filteredPatients.length;
    const paginatedPatients = filteredPatients.slice(skip, skip + limit);

    const data = paginatedPatients.map((patient) => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      fullName: patient.firstName + ' ' + patient.lastName,
      documentType: patient.documentType,
      documentNumber: patient.documentNumber,
      birthDate: patient.dateOfBirth,
      isMinor: patient.isMinor,
      guardianName: patient.guardianName ?? undefined,
      gender: patient.gender,
      email: patient.email ?? undefined,
      phone: patient.phone ?? undefined,
      address: patient.address ?? undefined,
      consentMechanism: patient.consentMechanism,
      consentAcceptedAt: patient.consentAcceptedAt,
      medicalRecordNumber: patient.medicalRecordNumber,
      createdAt: patient.createdAt
    }));

    return {
      patients: data,
      total
    };
  }

  // Para otros tipos de búsqueda
  const whereConditions: {
    isActive: boolean;
    deletedAt: null;
    documentNumber?: string;
    medicalRecordNumber?: { contains: string; mode: 'insensitive' };
  } = {
    isActive: true,
    deletedAt: null
  };

  if (search) {
    if (searchBy === 'documentNumber') {
      // Búsqueda exacta por documento (usa hash automáticamente vía middleware)
      whereConditions.documentNumber = search;
    } else if (searchBy === 'medicalRecordNumber') {
      // El número de expediente médico NO está encriptado
      whereConditions.medicalRecordNumber = {
        contains: search,
        mode: 'insensitive'
      };
    }
  }

  const total = await prisma.patient.count({
    where: whereConditions
  });

  const patients = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });

  const data = patients.map((patient) => ({
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    fullName: patient.firstName + ' ' + patient.lastName,
    documentType: patient.documentType,
    documentNumber: patient.documentNumber,
    birthDate: patient.dateOfBirth,
    isMinor: patient.isMinor,
    guardianName: patient.guardianName ?? undefined,
    gender: patient.gender,
    email: patient.email ?? undefined,
    phone: patient.phone ?? undefined,
    address: patient.address ?? undefined,
    consentMechanism: patient.consentMechanism,
    consentAcceptedAt: patient.consentAcceptedAt,
    medicalRecordNumber: patient.medicalRecordNumber,
    createdAt: patient.createdAt
  }));

  return {
    patients: data,
    total
  };
}
