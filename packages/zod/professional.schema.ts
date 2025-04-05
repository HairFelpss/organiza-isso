import { z } from 'zod';

export const ProfessionalSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  businessName: z.string().min(2),
  specialties: z.array(z.string()).min(1),
  profileDescription: z.string().optional(),
  averageRating: z.number().min(0).max(5).default(0),
  totalRatings: z.number().int().default(0),
  totalAppointments: z.number().int().default(0),
});

export type Professional = z.infer<typeof ProfessionalSchema>;

export const CreateProfessionalSchema = z.object({
  businessName: z.string().min(2),
  specialties: z.array(z.string()).min(1),
  profileDescription: z.string().optional(),
});

export type CreateProfessionalDto = z.infer<typeof CreateProfessionalSchema>;

// packages/zod/schemas/professional.schema.ts
export const CreateProfessionalInput = ProfessionalSchema.omit({
  id: true,
  userId: true,
  averageRating: true,
  totalRatings: true,
  totalAppointments: true,
});

