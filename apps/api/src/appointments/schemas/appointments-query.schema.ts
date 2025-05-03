import { PaginationSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  getDefaultEndDate,
  getDefaultStartDate,
} from '../../common/utils/generate-default-date';

export const AppointmentsQuerySchema = PaginationSchema.extend({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED']).optional(),
  startDate: z.coerce
    .date()
    .default(getDefaultStartDate)
    .transform((date) => {
      // Garante que a data sempre comece à meia-noite
      date.setHours(0, 0, 0, 0);
      return date;
    }),
  endDate: z.coerce
    .date()
    .default(getDefaultEndDate)
    .transform((date) => {
      // Garante que a data sempre termine no último momento do dia
      date.setHours(23, 59, 59, 999);
      return date;
    }),
  orderBy: z
    .enum(['dateTime', 'status', 'createdAt'])
    .optional()
    .default('dateTime'),
});

export class AppointmentsQueryDto extends createZodDto(
  AppointmentsQuerySchema,
) {}
