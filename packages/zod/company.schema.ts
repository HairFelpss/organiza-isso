import { z } from 'zod';

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(255).optional().nullable(),
  ownerId: z.string().uuid(),
  type: z.string().max(50).optional().nullable(), // Prisma: String?
  settings: z.any().optional().nullable(), // JSON
  isActive: z.boolean().default(true).optional(), // Não está no Prisma, mas pode ser útil
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCompanySchema = CompanySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(2).max(100),
  ownerId: z.string().uuid(),
  type: z.string().max(50).optional().nullable(),
  description: z.string().max(255).optional().nullable(),
  settings: z.any().optional().nullable(),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();

export type Company = z.infer<typeof CompanySchema>;
export type CreateCompany = z.infer<typeof CreateCompanySchema>;
export type UpdateCompany = z.infer<typeof UpdateCompanySchema>;