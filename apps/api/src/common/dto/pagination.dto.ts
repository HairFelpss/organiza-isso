import { PaginationSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class PaginationDto extends createZodDto(PaginationSchema) {}
