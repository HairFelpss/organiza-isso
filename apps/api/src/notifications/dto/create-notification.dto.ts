import { CreateNotificationSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateNotificationDto extends createZodDto(
  CreateNotificationSchema,
) {}
