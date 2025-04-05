import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const RoleGuard = (role: Role) => SetMetadata('role', role);
