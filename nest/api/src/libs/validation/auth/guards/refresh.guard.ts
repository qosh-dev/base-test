import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ApiError, UnauthorizedErrorCode } from 'src/libs/validation/error-codes';
import { JwtService } from '../jwt.service';
import { BaseTokenPayload } from '../types';

@Injectable()
export class RefreshGuard implements CanActivate {
  private readonly logger = new Logger(RefreshGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = await this.extractUser(req);

    if (!user) {
      throw new ApiError(UnauthorizedErrorCode.TOKEN_INVALID);
    }

    req.user = user;
    return true;
  }

  private async extractUser(req: any): Promise<BaseTokenPayload | null> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return null;

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) return null;

      const payload = this.jwtService.verifyToken(token);
      if (!payload) {
        throw new ApiError(UnauthorizedErrorCode.TOKEN_INVALID);
      }

      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      this.logger.error('Error in Refresh Guard', error instanceof Error ? error.stack : error);
      throw new ApiError(UnauthorizedErrorCode.TOKEN_INVALID);
    }
  }
}
