import { UpdateNotificationSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class UpdateNotificationDto extends createZodDto(
  UpdateNotificationSchema,
) {}
