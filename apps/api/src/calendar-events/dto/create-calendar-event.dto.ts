import {
  CreateCalendarEventSchema,
  FindEventsParamsSchema,
} from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateCalendarEventDto extends createZodDto(
  CreateCalendarEventSchema,
) {}

export class FindEventsParamsDto extends createZodDto(FindEventsParamsSchema) {}
