import { PaginationSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CompaniesQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  type: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  orderBy: z.enum(['name', 'createdAt']).optional().default('createdAt'),
});

export class CompaniesQueryDto extends createZodDto(CompaniesQuerySchema) {}
