import { z } from 'zod';

export const CalendarEventTypeSchema = z.enum([
  "APPOINTMENT",
  "BLOCK",
  "VACATION",
  "BREAK",
  "CUSTOM"
]).describe("Tipo do evento no calendário");

// Schema base sem as validações
export const baseCalendarEventSchema = z.object({
  calendarId: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date(),
  eventType: CalendarEventTypeSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  isAvailable: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

// Tipo do evento
export type CalendarEvent = z.infer<typeof baseCalendarEventSchema>;

// Função de validação
const validateCalendarEvent = (data: CalendarEvent): string | true => {
  if (data.startTime >= data.endTime) {
    return 'End time must be after start time';
  }

  const now = new Date();
  if (data.startTime <= now) {
    return 'Start time must be in the future';
  }

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  if (data.startTime > oneYearFromNow) {
    return 'Event cannot be scheduled more than 1 year in advance';
  }

  const durationInMinutes = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60);
  if (durationInMinutes < 15) {
    return 'Event must be at least 15 minutes long';
  }

  if (durationInMinutes > 480) {
    return 'Event cannot be longer than 8 hours';
  }

  return true;
};

// Schema de criação com validações
export const CreateCalendarEventSchema = baseCalendarEventSchema.transform((data, ctx) => {
  const validationResult = validateCalendarEvent(data);
  if (validationResult !== true) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: validationResult,
    });
    return z.NEVER;
  }
  return data;
});

// Agora o partial vai funcionar
export const UpdateCalendarEventSchema = baseCalendarEventSchema.partial().transform((data, ctx) => {
  if (data.startTime && data.endTime) {
    const validationResult = validateCalendarEvent({ ...data } as CalendarEvent);
    if (validationResult !== true) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationResult,
      });
      return z.NEVER;
    }
  }
  return data;
});

export const FindEventsParamsSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  eventType: CalendarEventTypeSchema.optional(),
  isAvailable: z.boolean().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  orderBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
}).transform((data, ctx) => {
  if (data.startDate && data.endDate && data.startDate >= data.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Start date must be before end date',
      path: ['endDate'],
    });
    return z.NEVER;
  }
  return data;
});