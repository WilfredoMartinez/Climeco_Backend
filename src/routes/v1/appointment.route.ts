import { Router } from 'express';

import * as appointmentController from '@/controllers/appointment.controller';
import { authenticate } from '@/middlewares/authentication';
import { authorize } from '@/middlewares/authorization';
import { validate } from '@/middlewares/validation';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  cancelAppointmentSchema,
  getAppointmentsQuerySchema,
  appointmentIdSchema,
  transitionNotesSchema,
  transitionToVitalsSchema,
  updateVitalSignsSchema,
  availableSlotsSchema,
  completeDentalConsultationSchema
} from '@/schemas/appointment.schema';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(['appointments:create']),
  validate(createAppointmentSchema),
  appointmentController.createAppointment
);

router.get(
  '/',
  authorize(['appointments:read']),
  validate(getAppointmentsQuerySchema, 'query'),
  appointmentController.getAppointments
);

router.get(
  '/available-slots',
  authorize(['appointments:read']),
  validate(availableSlotsSchema, 'query'),
  appointmentController.getAvailableSlots
);

router.get(
  '/:id/vitals',
  authorize(['appointments:read']),
  validate(appointmentIdSchema, 'params'),
  appointmentController.getVitalSigns
);

router.get(
  '/:id/patient-info',
  authorize(['appointments:read']),
  validate(appointmentIdSchema, 'params'),
  appointmentController.getPatientInfoInAppointment
);

router.patch(
  '/:id/vitals',
  authorize(['appointments:update']),
  validate(appointmentIdSchema, 'params'),
  validate(updateVitalSignsSchema),
  appointmentController.updateVitalSigns
);

router.get(
  '/:id',
  authorize(['appointments:read']),
  validate(appointmentIdSchema, 'params'),
  appointmentController.getAppointmentById
);

router.put(
  '/:id',
  authorize(['appointments:update']),
  validate(appointmentIdSchema, 'params'),
  validate(updateAppointmentSchema),
  appointmentController.updateAppointment
);

router.patch(
  '/:id/cancel',
  authorize(['appointments:cancel']),
  validate(appointmentIdSchema, 'params'),
  validate(cancelAppointmentSchema),
  appointmentController.cancelAppointment
);

router.patch(
  '/:id/check-in',
  authorize(['appointments:vitals']),
  validate(appointmentIdSchema, 'params'),
  validate(transitionToVitalsSchema),
  appointmentController.transitionToVitals
);

router.patch(
  '/:id/in-progress',
  authorize(['appointments:in-progress']),
  validate(appointmentIdSchema, 'params'),
  validate(transitionNotesSchema),
  appointmentController.transitionToInProgress
);

router.patch(
  '/:id/ready',
  authorize(['appointments:ready']),
  validate(appointmentIdSchema, 'params'),
  validate(transitionNotesSchema),
  appointmentController.transitionToReady
);

router.patch(
  '/:id/completed',
  authorize(['appointments:completed']),
  validate(appointmentIdSchema, 'params'),
  validate(transitionNotesSchema),
  appointmentController.transitionToCompleted
);

router.patch(
  '/:id/no-show',
  authorize(['appointments:no-show']),
  validate(appointmentIdSchema, 'params'),
  validate(transitionNotesSchema),
  appointmentController.transitionToNoShow
);

router.post(
  '/:id/complete-dental-consultation',
  authorize(['appointments:complete-dental-consultation']),
  validate(appointmentIdSchema, 'params'),
  validate(completeDentalConsultationSchema),
  appointmentController.completeDentalConsultation
);

router.delete(
  '/:id',
  authorize(['appointments:delete']),
  validate(appointmentIdSchema, 'params'),
  appointmentController.deleteAppointment
);

export default router;
