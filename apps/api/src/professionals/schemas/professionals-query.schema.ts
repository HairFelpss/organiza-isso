import { PaginationSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ProfessionalsQuerySchema = PaginationSchema.extend({
  // Campos específicos para profissionais
  search: z.string().optional(),
  specialties: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === 'string' ? [val] : val))
    .optional(),
  isActive: z.coerce.boolean().optional(),
  companyId: z.string().uuid().optional(),
  subscriptionPlan: z.enum(['FREE', 'PRO', 'PREMIUM']).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  // Sobrescreve orderBy com campos específicos
  orderBy: z
    .enum(['businessName', 'averageRating', 'createdAt'])
    .optional()
    .default('createdAt'),
});

export class ProfessionalsQueryDto extends createZodDto(
  ProfessionalsQuerySchema,
) {}
