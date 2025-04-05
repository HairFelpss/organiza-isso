// src/auth/decorators/role.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const RoleKey = 'role';
export const RoleGuard = (role: Role) => SetMetadata(RoleKey, role);
