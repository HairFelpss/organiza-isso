// zod/notification.schema.ts
import { z } from 'zod';

export const NotificationTypeSchema = z.enum(['EMAIL', 'PUSH']);

export const NotificationSchema = z.object({
  userId: z.string().uuid(),
  type: NotificationTypeSchema,
  message: z.string(),
  deliveredAt: z.date().optional(),
});

export const CreateNotificationSchema = NotificationSchema;
export const UpdateNotificationSchema = NotificationSchema.partial();