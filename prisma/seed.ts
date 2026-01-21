import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Hash de contraseña para el admin
  const adminPasswordHashed = await bcrypt.hash('Admin123*', 10);

  // Crear rol de administrador
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrator with full access'
    }
  });

  // Definir todos los permisos del sistema
  const permissionsData = [
    // Dashboard
    { name: 'dashboard:read', description: 'Ver el panel de control' },
    // Prescriptions
    { name: 'prescriptions:create', description: 'Crear nuevas recetas' },
    { name: 'prescriptions:read', description: 'Ver información de recetas' },
    {
      name: 'prescriptions:update',
      description: 'Editar información de recetas'
    },
    { name: 'prescriptions:delete', description: 'Eliminar recetas' },
    {
      name: 'appointments:complete-dental-consultation',
      description: 'Completar consulta dental'
    },
    // Patients
    {
      name: 'patients:create',
      description: 'Crear/registrar nuevos pacientes'
    },
    { name: 'patients:read', description: 'Ver información de pacientes' },
    { name: 'patients:update', description: 'Editar información de pacientes' },
    { name: 'patients:delete', description: 'Eliminar pacientes' },
    {
      name: 'patients:assign-allergies',
      description: 'Asignar alergias a pacientes'
    },

    // Roles
    { name: 'roles:create', description: 'Crear nuevos roles' },
    { name: 'roles:read', description: 'Ver información de roles' },
    { name: 'roles:update', description: 'Editar información de roles' },
    { name: 'roles:delete', description: 'Eliminar roles' },
    {
      name: 'roles:assign-permissions',
      description: 'Asignar permisos a roles'
    },

    // Role Permissions
    { name: 'role:view', description: 'Ver permisos de roles' },
    {
      name: 'role:assign-permissions',
      description: 'Asignar permisos a roles'
    },

    // Specialties
    { name: 'specialties:create', description: 'Crear nuevas especialidades' },
    {
      name: 'specialties:read',
      description: 'Ver información de especialidades'
    },
    {
      name: 'specialties:update',
      description: 'Editar información de especialidades'
    },
    { name: 'specialties:delete', description: 'Eliminar especialidades' },

    // Allergies
    { name: 'allergies:create', description: 'Crear nuevas alergias' },
    { name: 'allergies:read', description: 'Ver información de alergias' },
    { name: 'allergies:update', description: 'Editar información de alergias' },
    { name: 'allergies:delete', description: 'Eliminar alergias' },

    // Surveys
    { name: 'surveys:create', description: 'Crear nuevas encuestas' },
    { name: 'surveys:read', description: 'Ver información de encuestas' },
    { name: 'surveys:update', description: 'Editar información de encuestas' },
    { name: 'surveys:delete', description: 'Eliminar encuestas' },
    {
      name: 'surveys:manage-questions',
      description: 'Gestionar preguntas de encuestas'
    },

    // Patient Surveys
    {
      name: 'patient-surveys:create',
      description: 'Crear encuestas de pacientes'
    },
    { name: 'patient-surveys:read', description: 'Ver encuestas de pacientes' },

    // Medications
    { name: 'medications:create', description: 'Crear nuevos medicamentos' },
    {
      name: 'medications:read',
      description: 'Ver información de medicamentos'
    },
    {
      name: 'medications:update',
      description: 'Editar información de medicamentos'
    },
    { name: 'medications:delete', description: 'Eliminar medicamentos' },

    // Medication Categories
    {
      name: 'medication-categories:create',
      description: 'Crear categorías de medicamentos'
    },
    {
      name: 'medication-categories:read',
      description: 'Ver categorías de medicamentos'
    },
    {
      name: 'medication-categories:update',
      description: 'Editar categorías de medicamentos'
    },
    {
      name: 'medication-categories:delete',
      description: 'Eliminar categorías de medicamentos'
    },

    // Accounts Payable
    { name: 'accounts-payable:create', description: 'Crear cuentas por pagar' },
    { name: 'accounts-payable:read', description: 'Ver cuentas por pagar' },
    {
      name: 'accounts-payable:update',
      description: 'Editar cuentas por pagar'
    },
    {
      name: 'accounts-payable:delete',
      description: 'Eliminar cuentas por pagar'
    },

    // Payments
    { name: 'payments:create', description: 'Registrar pagos' },
    { name: 'payments:read', description: 'Ver información de pagos' },
    { name: 'payments:update', description: 'Editar información de pagos' },

    // Exam Categories
    {
      name: 'exam-categories:create',
      description: 'Crear categorías de exámenes'
    },
    { name: 'exam-categories:read', description: 'Ver categorías de exámenes' },
    {
      name: 'exam-categories:update',
      description: 'Editar categorías de exámenes'
    },
    {
      name: 'exam-categories:delete',
      description: 'Eliminar categorías de exámenes'
    },

    // Exam Types
    { name: 'exam-types:create', description: 'Crear tipos de exámenes' },
    { name: 'exam-types:read', description: 'Ver tipos de exámenes' },
    { name: 'exam-types:update', description: 'Editar tipos de exámenes' },
    { name: 'exam-types:delete', description: 'Eliminar tipos de exámenes' },

    // Exams
    { name: 'exams:create', description: 'Crear nuevos exámenes' },
    { name: 'exams:read', description: 'Ver información de exámenes' },
    { name: 'exams:update', description: 'Editar información de exámenes' },
    { name: 'exams:delete', description: 'Eliminar exámenes' },

    // Appointments
    { name: 'appointments:create', description: 'Crear nuevas citas' },
    { name: 'appointments:read', description: 'Ver información de citas' },
    { name: 'appointments:update', description: 'Editar información de citas' },
    { name: 'appointments:delete', description: 'Eliminar citas' },
    { name: 'appointments:cancel', description: 'Cancelar citas' },
    { name: 'appointments:vitals', description: 'Registrar signos vitales' },
    {
      name: 'appointments:in-progress',
      description: 'Marcar cita en progreso'
    },
    { name: 'appointments:ready', description: 'Marcar cita como lista' },
    { name: 'appointments:completed', description: 'Completar citas' },
    {
      name: 'appointments:no-show',
      description: 'Marcar cita como no asistida'
    },

    // Dental History
    { name: 'dental-history:create', description: 'Crear historial dental' },
    { name: 'dental-history:read', description: 'Ver historial dental' },
    { name: 'dental-history:update', description: 'Editar historial dental' },
    { name: 'dental-history:delete', description: 'Eliminar historial dental' },

    // Users
    { name: 'users:create', description: 'Crear nuevos usuarios' },
    { name: 'users:read', description: 'Ver información de usuarios' },
    { name: 'users:update', description: 'Editar información de usuarios' },
    { name: 'users:delete', description: 'Eliminar usuarios' },
    {
      name: 'users:change-password',
      description: 'Cambiar contraseña de usuarios'
    },

    // Reports
    { name: 'reports:read', description: 'Ver reportes del sistema' }
  ];

  // Crear todos los permisos
  const permissions = await Promise.all(
    permissionsData.map((permData) =>
      prisma.permission.upsert({
        where: { name: permData.name },
        update: {},
        create: {
          name: permData.name,
          description: permData.description,
          isActive: true
        }
      })
    )
  );

  // Asignar todos los permisos al rol de administrador
  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      })
    )
  );

  // Crear especialidad de administración
  const adminSpecialty = await prisma.specialty.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Administrative and management services'
    }
  });

  // Crear usuario administrador
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      roleId: adminRole.id,
      specialtyId: adminSpecialty.id,
      username: 'admin',
      passwordHash: adminPasswordHashed,
      fullName: 'Administrator',
      phone: '12121212'
    }
  });
}

main()
  .catch(async (e: unknown): Promise<never> => {
    await prisma.$disconnect();
    throw e;
  })
  .finally(async (): Promise<void> => {
    await prisma.$disconnect();
  });
