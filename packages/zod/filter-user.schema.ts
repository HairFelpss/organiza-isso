import { z } from 'zod';
import { RoleSchema } from './role-user.schema';

export const FilterUserSchema = z.object({
  search: z.string().optional(),
  role: RoleSchema.optional(),
  isActive: z.boolean().optional(),
  orderBy: z.enum(['name', 'email', 'createdAt']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  order: z.enum(['asc', 'desc']).default('desc'),
}).refine((data) => {
  if (data.orderBy && !['asc', 'desc'].includes(data.order)) {
    return false;
  }

  if (data.role && !['CLIENT', 'PROFESSIONAL', 'ADMIN'].includes(data.role)) {
    return false;
  }

  if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
    return false;
  }

  if (data.page < 1 || data.limit < 1) {
    return false;
  }

  if (data.limit > 100) {
    return false;
  }

  if (data.search && data.search.length < 3) {
    return false;
  }

  return true;
});