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

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

