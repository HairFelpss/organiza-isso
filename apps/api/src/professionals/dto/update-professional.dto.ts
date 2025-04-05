import { ProfessionalSchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export const UpdateProfessionalSchema = ProfessionalSchema.partial();

export class UpdateProfessionalDto extends createZodDto(
  UpdateProfessionalSchema,
) {}
