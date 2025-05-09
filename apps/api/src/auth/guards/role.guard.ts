import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

interface AuthenticatedRequest {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user?.role === requiredRole;
  }
}
