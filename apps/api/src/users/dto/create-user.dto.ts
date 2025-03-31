import { RegisterRawSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(
  RegisterRawSchema.omit({ confirmPassword: true }),
) {}
