import { UpdateEstablishmentSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class UpdateEstablishmentDto extends createZodDto(
  UpdateEstablishmentSchema,
) {}
