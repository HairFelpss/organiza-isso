import { z } from 'zod';

export const ProviderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  businessName: z.string().min(2),
  specialties: z.array(z.string()).min(1),
  profileDescription: z.string().optional(),
  averageRating: z.number().min(0).max(5).default(0),
  totalRatings: z.number().int().default(0),
  totalAppointments: z.number().int().default(0),
});

export type Provider = z.infer<typeof ProviderSchema>;

export const CreateProviderSchema = z.object({
  businessName: z.string().min(2),
  specialties: z.array(z.string()).min(1),
  profileDescription: z.string().optional(),
});

export type CreateProviderDto = z.infer<typeof CreateProviderSchema>;
