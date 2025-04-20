import { z } from 'zod';

// Enums
export const RoleSchema = z.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN']);
export const PlanSchema = z.enum(['FREE', 'PRO', 'PREMIUM']);

// Base Schema para campos comuns
export const UserBaseSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido').optional().nullable(),
  document: z.string().min(11, 'CPF/CNPJ inválido').optional().nullable(),
  role: RoleSchema,
});

// Schema completo do usuário
export const UserSchema = UserBaseSchema.extend({
  id: z.string().uuid(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  refreshToken: z.string().optional().nullable(),
  lastLogin: z.date().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema para criação de usuário
export const CreateUserSchema = UserBaseSchema.extend({
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

// Schema para atualização de usuário (todos os campos são opcionais)
export const UpdateUserSchema = UserBaseSchema
  .partial()
  .extend({
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
  });

// Schema para atualização de senha
export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha atual deve ter no mínimo 6 caracteres'),
  newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

// Schema para atualização de role
export const UpdateUserRoleSchema = z.object({
  role: RoleSchema,
});