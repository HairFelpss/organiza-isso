import { RegisterRawSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class AuthenticateDto extends createZodDto(
  RegisterRawSchema.omit({
    name: true,
    document: true,
    phone: true,
    confirmPassword: true,
  }),
) {}
