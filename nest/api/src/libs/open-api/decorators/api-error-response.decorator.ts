import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
    BadRequestErrorCode,
    UnauthorizedErrorCode,
    ForbiddenErrorCode,
    NotFoundErrorCode,
    ConflictErrorCode,
    UnprocessableEntityErrorCode,
    TooManyRequestsErrorCode,
    InternalServerErrorCode,
} from '../../validation/error-codes';

export const ApiErrorResponse = () => {
  const errorResponseSchema = {
    type: 'object' as const,
    properties: {
      statusCode: {
        type: 'number' as const,
        example: 404,
      },
      statusKey: {
        type: 'number' as const,
        example: NotFoundErrorCode.USER_NOT_FOUND,
      },
      message: {
        type: 'string' as const,
        example: '',
      },
      error: {
        type: 'string' as const,
        example: 'Not Found',
      },
    },
  };

  const allErrorEnums = [
    { status: HttpStatus.BAD_REQUEST, enum: BadRequestErrorCode },
    { status: HttpStatus.UNAUTHORIZED, enum: UnauthorizedErrorCode },
    { status: HttpStatus.FORBIDDEN, enum: ForbiddenErrorCode },
    { status: HttpStatus.NOT_FOUND, enum: NotFoundErrorCode },
    { status: HttpStatus.CONFLICT, enum: ConflictErrorCode },
    { status: HttpStatus.UNPROCESSABLE_ENTITY, enum: UnprocessableEntityErrorCode },
    { status: HttpStatus.TOO_MANY_REQUESTS, enum: TooManyRequestsErrorCode },
    { status: HttpStatus.INTERNAL_SERVER_ERROR, enum: InternalServerErrorCode },
  ];

  const decorators = allErrorEnums.map(({ status, enum: errorEnum }) => {
    const possibleStatusKeys = Object.values(errorEnum).filter(
      (key): key is number => typeof key === 'number',
    );

    return ApiResponse({
      status,
      description: `Error response with status ${status}`,
      schema: {
        ...errorResponseSchema,
        properties: {
          ...errorResponseSchema.properties,
          statusCode: {
            type: 'number' as const,
            example: status,
          },
          statusKey: {
            type: 'number' as const,
            enum: possibleStatusKeys,
            example: possibleStatusKeys[0] || status * 1000 + 1,
          },
        },
      },
    });
  });

  return decorators;
};
