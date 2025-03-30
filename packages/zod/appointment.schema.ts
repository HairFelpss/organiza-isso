
import { z } from 'zod';

export const AppointmentStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELED']);
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  providerId: z.string().uuid(),
  clientId: z.string().uuid(),
  scheduleId: z.string().uuid(),
  status: AppointmentStatusSchema,
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const CreateAppointmentSchema = z.object({
  providerId: z.string().uuid(),
  scheduleId: z.string().uuid(),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;

export const UpdateAppointmentStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELED']),
  appointmentId: z.string().uuid(),
});

export type UpdateAppointmentStatusDto = z.infer<typeof UpdateAppointmentStatusSchema>;
