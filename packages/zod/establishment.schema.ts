import { z } from "zod";

export const EstablishmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  address: z.string().max(255).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  openTime: z.string().min(1), // Horário em string, ex: "08:00"
  closeTime: z.string().min(1),
  settings: z.any().optional().nullable(),
  companyId: z.string().uuid(),
  isActive: z.boolean().default(true).optional(), // Não está no Prisma, mas pode ser útil
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateEstablishmentSchema = EstablishmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  name: z.string().min(2).max(100),
  companyId: z.string().uuid(),
  address: z.string().max(255).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  openTime: z.string().min(1),
  closeTime: z.string().min(1),
  settings: z.any().optional().nullable(),
});

export const UpdateEstablishmentSchema = CreateEstablishmentSchema.partial();

export type Establishment = z.infer<typeof EstablishmentSchema>;
export type CreateEstablishment = z.infer<typeof CreateEstablishmentSchema>;
export type UpdateEstablishment = z.infer<typeof UpdateEstablishmentSchema>;
