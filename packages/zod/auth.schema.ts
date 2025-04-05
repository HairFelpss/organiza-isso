import { z } from 'zod';

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