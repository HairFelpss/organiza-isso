import { UpdateCalendarEventSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class UpdateCalendarEventDto extends createZodDto(
  UpdateCalendarEventSchema,
) {}
