import { FilterUserSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class FilterUserDto extends createZodDto(FilterUserSchema) {}
