import { z } from 'zod';

export const RoleSchema = z.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN']);

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
  password: z.string().min(6).optional()
});

export type User = z.infer<typeof UserSchema>;

export const UpdateUserSchema = UserSchema.partial()

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export const UpdatePasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirmation: z.string().min(6),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'As senhas não conferem',
});
