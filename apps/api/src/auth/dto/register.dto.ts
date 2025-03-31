import { RegisterRawSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class RegisterAuthDto extends createZodDto(
  RegisterRawSchema.omit({
    confirmPassword: true,
  }),
) {}
