import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ApiError,
  ForbiddenErrorCode,
  UnauthorizedErrorCode,
} from 'src/libs/validation/error-codes';
import { BaseTokenPayload, ROLE_KEY, UserRole } from '../types';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();
      const user = req.user as BaseTokenPayload;

      if (!user) {
        throw new ApiError(UnauthorizedErrorCode.INVALID_CREDENTIALS);
      }

      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLE_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      if (user.role === 'admin') {
        return true;
      }

      const hasAccess = requiredRoles.some((role) => role === user.role);

      if (!hasAccess) {
        this.logger.warn(
          `User ${user.userId} (${user.role}) does not have required roles: [${requiredRoles.join(', ')}]`,
        );
        throw new ApiError(ForbiddenErrorCode.INSUFFICIENT_PERMISSIONS);
      }

      return hasAccess;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      this.logger.error('Unexpected error in RoleGuard', error instanceof Error ? error.stack : error);
      return false;
    }
  }
}
