import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
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
import {
  getValidationErrorCodes,
  createValidationErrorSchema,
} from '../utils/validation-extractor';

export interface SuccessResponse<T = any> {
  model?: Type<T>;
  isArray?: boolean;
  description?: string;
}

export interface ApiResponsesConfig {
  [HttpStatus.OK]?: SuccessResponse;
  [HttpStatus.CREATED]?: SuccessResponse;
  [HttpStatus.BAD_REQUEST]?: BadRequestErrorCode[];
  [HttpStatus.UNAUTHORIZED]?: UnauthorizedErrorCode[];
  [HttpStatus.FORBIDDEN]?: ForbiddenErrorCode[];
  [HttpStatus.NOT_FOUND]?: NotFoundErrorCode[];
  [HttpStatus.CONFLICT]?: ConflictErrorCode[];
  [HttpStatus.UNPROCESSABLE_ENTITY]?: UnprocessableEntityErrorCode[];
  [HttpStatus.TOO_MANY_REQUESTS]?: TooManyRequestsErrorCode[];
  [HttpStatus.INTERNAL_SERVER_ERROR]?: InternalServerErrorCode[];
  autoValidationErrors?: Type<any>;
}

function getErrorStatusName(status: HttpStatus): string {
  return (HttpStatus[status] || 'UNKNOWN')
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
}

function createErrorResponseSchema(statusCodes: number[], status: HttpStatus) {
  const statusName = getErrorStatusName(status);

  return {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: status,
      },
      statusKey: {
        type: 'number',
        enum: statusCodes,
        description: 'Structured error status key',
      },
      message: {
        type: 'string',
        example: '',
      },
      error: {
        type: 'string',
        example: statusName,
      },
    },
    example: {
      statusCode: status,
      statusKey: statusCodes[0],
      message: '',
      error: statusName,
    },
  };
}

export const ApiResponses = (config: ApiResponsesConfig) => {
  const decorators: any[] = [];

  // Обработка успешных ответов (200, 201)
  if (config[HttpStatus.OK]) {
    const {
      model,
      isArray = false,
      description = 'Success',
    } = config[HttpStatus.OK];
    decorators.push(
      SwaggerApiResponse({
        status: HttpStatus.OK,
        description,
        ...(model && { type: model, isArray }),
      }),
    );
  }

  if (config[HttpStatus.CREATED]) {
    const {
      model,
      isArray = false,
      description = 'Created',
    } = config[HttpStatus.CREATED];
    decorators.push(
      SwaggerApiResponse({
        status: HttpStatus.CREATED,
        description,
        ...(model && { type: model, isArray }),
      }),
    );
  }

  // Автоматическое извлечение валидационных ошибок
  let validationErrorCodes: UnprocessableEntityErrorCode[] = [];
  if (config.autoValidationErrors) {
    validationErrorCodes = getValidationErrorCodes(config.autoValidationErrors);
  }

  // Объединяем ручные и автоматические валидационные ошибки
  const existingValidationCodes = config[HttpStatus.UNPROCESSABLE_ENTITY] || [];
  const allValidationCodes = [
    ...new Set([...existingValidationCodes, ...validationErrorCodes]),
  ];

  const updatedConfig = {
    ...config,
    [HttpStatus.UNPROCESSABLE_ENTITY]:
      allValidationCodes.length > 0 ? allValidationCodes : undefined,
  };

  // Обработка ошибок
  const errorStatuses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.CONFLICT,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.TOO_MANY_REQUESTS,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];

  errorStatuses.forEach((status) => {
    const errorCodes = (updatedConfig as any)[status];
    if (errorCodes && errorCodes.length > 0) {
      if (
        status === HttpStatus.UNPROCESSABLE_ENTITY &&
        config.autoValidationErrors
      ) {
        decorators.push(
          SwaggerApiResponse({
            status,
            description: `${getErrorStatusName(status)} - Validation errors with field details`,
            schema: createValidationErrorSchema(config.autoValidationErrors),
          }),
        );
      } else {
        decorators.push(
          SwaggerApiResponse({
            status,
            description: getErrorStatusName(status),
            schema: createErrorResponseSchema(errorCodes, status),
          }),
        );
      }
    }
  });

  return applyDecorators(...decorators);
};
