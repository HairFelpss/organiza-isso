import { UpdateCompanySchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class UpdateCompanyDto extends createZodDto(UpdateCompanySchema) {}
