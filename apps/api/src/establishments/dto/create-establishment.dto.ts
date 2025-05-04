import { CreateEstablishmentSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateEstablishmentDto extends createZodDto(
  CreateEstablishmentSchema,
) {}
