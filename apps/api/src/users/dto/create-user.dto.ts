import { RegisterSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(RegisterSchema) {}
