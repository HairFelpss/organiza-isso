import { UpdateUserSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
