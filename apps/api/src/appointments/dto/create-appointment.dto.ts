import { CreateAppointmentSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateAppointmentDto extends createZodDto(
  CreateAppointmentSchema,
) {}
