import { z } from 'zod';

export const ScheduleSchema = z.object({
  id: z.string().uuid(),
  professionalId: z.string().uuid(),
  dateTime: z.string().datetime(),
  duration: z.number().int().positive(),
  isAvailable: z.boolean(),
});

export type Schedule = z.infer<typeof ScheduleSchema>;

export const CreateScheduleSchema = z.object({
  dateTime: z.string().datetime(),
  duration: z.number().int().positive(),
});

export type CreateScheduleDto = z.infer<typeof CreateScheduleSchema>;
