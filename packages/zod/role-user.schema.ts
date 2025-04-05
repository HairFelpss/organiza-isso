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