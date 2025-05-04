import { CreateFacilitySchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class CreateFacilityDto extends createZodDto(CreateFacilitySchema) {}
