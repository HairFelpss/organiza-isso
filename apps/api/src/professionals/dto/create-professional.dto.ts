import { CreateProfessionalInput } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateProfessionalDto extends createZodDto(
  CreateProfessionalInput,
) {}
