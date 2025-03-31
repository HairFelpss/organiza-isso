import { RegisterRawSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export const ForgotPasswordSchema = RegisterRawSchema.omit({
  name: true,
  document: true,
  phone: true,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
