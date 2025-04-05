import { z } from 'zod';

export const RoleSchema = z.enum(['CLIENT', 'PROVIDER', 'ADMIN']);

export type Role = z.infer<typeof RoleSchema>;

export const UpdateUserRoleSchema = z.object({
  role: RoleSchema,
});

export type UpdateUserRoleDto = z.infer<typeof UpdateUserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2),
  role: RoleSchema,
});

export type User = z.infer<typeof UserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;


//////////////////////////////////////////////////


export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterRawSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  document: z.string().min(11).max(11),
  phone: z.string().min(10).max(11),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

////////////////////////////

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


