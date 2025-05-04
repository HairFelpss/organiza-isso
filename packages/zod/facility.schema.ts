import { z } from 'zod';

export const FacilitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(255).optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  settings: z.any().optional().nullable(),
  establishmentId: z.string().uuid(),
  isActive: z.boolean().default(true).optional(), // Não está no Prisma, mas pode ser útil
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateFacilitySchema = FacilitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(2).max(100),
  establishmentId: z.string().uuid(),
  description: z.string().max(255).optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  settings: z.any().optional().nullable(),
});

export const UpdateFacilitySchema = CreateFacilitySchema.partial();

export type Facility = z.infer<typeof FacilitySchema>;
export type CreateFacility = z.infer<typeof CreateFacilitySchema>;
export type UpdateFacility = z.infer<typeof UpdateFacilitySchema>;