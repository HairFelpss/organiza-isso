import { z } from 'zod';
import { RoleSchema } from './role-user.schema';

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  orderBy: z.enum(['name', 'email', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  role: RoleSchema.optional(),
});