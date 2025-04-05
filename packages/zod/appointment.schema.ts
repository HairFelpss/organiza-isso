import { z } from 'zod';

export const AppointmentStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELED']);
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  professionalId: z.string().uuid(), // Corrigido de providerId para professionalId
  clientId: z.string().uuid(),
  scheduleId: z.string().uuid(),
  status: AppointmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const CreateAppointmentSchema = z.object({
  professionalId: z.string().uuid(), // Corrigido de providerId para professionalId
  scheduleId: z.string().uuid(),
  status: AppointmentStatusSchema.optional(),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;

export const UpdateAppointmentSchema = z.object({
  status: AppointmentStatusSchema.optional(),
});

export type UpdateAppointmentDto = z.infer<typeof UpdateAppointmentSchema>;

export const UpdateAppointmentStatusSchema = z.object({
  appointmentId: z.string().uuid(),
  status: z.enum(['CONFIRMED', 'CANCELED']),
});

export type UpdateAppointmentStatusDto = z.infer<typeof UpdateAppointmentStatusSchema>;
