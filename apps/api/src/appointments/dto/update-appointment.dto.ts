import { AppointmentSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateAppointmentSchema = AppointmentSchema.partial();

export class UpdateAppointmentDto extends createZodDto(
  UpdateAppointmentSchema,
) {}
