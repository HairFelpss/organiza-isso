import { UpdateFacilitySchema } from '@organiza-isso-app/zod';
import { createZodDto } from 'nestjs-zod';

export class UpdateFacilityDto extends createZodDto(UpdateFacilitySchema) {}
