import { CreateCompanySchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateCompanyDto extends createZodDto(CreateCompanySchema) {}
