import { applyDecorators, HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiResponses } from 'src/libs/open-api';
import {
  ForbiddenErrorCode,
  UnauthorizedErrorCode,
} from 'src/libs/validation/error-codes';
import { RefreshGuard } from '../guards/refresh.guard';
import { RoleGuard } from '../guards/role.guard';
import { JwtAuthGuard } from '../guards/user-jwt.guard';
import { ROLE_KEY, UserRole } from '../types';

export const Authorized = (roles: UserRole[] = ['user']) =>
  applyDecorators(
    SetMetadata(ROLE_KEY, roles),
    UseGuards(JwtAuthGuard, RoleGuard),
    ApiBearerAuth('JWT-auth'),
    ApiResponses({
      [HttpStatus.UNAUTHORIZED]: [
        UnauthorizedErrorCode.INVALID_CREDENTIALS,
        UnauthorizedErrorCode.TOKEN_EXPIRED,
        UnauthorizedErrorCode.TOKEN_INVALID,
      ],
      [HttpStatus.FORBIDDEN]: [
        ForbiddenErrorCode.FORBIDDEN_RESOURCE,
        ForbiddenErrorCode.INSUFFICIENT_PERMISSIONS,
        ForbiddenErrorCode.USER_BLOCKED,
      ],
    }),
  );

export const AuthorizedWithRefreshToken = () =>
  applyDecorators(
    UseGuards(RefreshGuard),
    ApiBearerAuth('JWT-auth'),
    ApiResponses({
      [HttpStatus.UNAUTHORIZED]: [
        UnauthorizedErrorCode.TOKEN_INVALID,
        UnauthorizedErrorCode.TOKEN_EXPIRED,
      ],
    }),
  );
