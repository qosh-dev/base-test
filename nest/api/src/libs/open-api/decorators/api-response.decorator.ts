import { HttpStatus } from '@nestjs/common';
import { ApiResponse as ApiResponseBase } from '@nestjs/swagger';
import {
    ReferenceObject,
    SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
    ErrorStatusKey,
    BadRequestErrorCode,
    UnauthorizedErrorCode,
    ForbiddenErrorCode,
    NotFoundErrorCode,
    ConflictErrorCode,
    UnprocessableEntityErrorCode,
    TooManyRequestsErrorCode,
    InternalServerErrorCode,
} from '../../validation/error-codes';

export type ErrorExpandedDesc = { key: string; description: string };

export function getDefaultStatusKey(status: HttpStatus): ErrorStatusKey {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return BadRequestErrorCode.INVALID_REQUEST;
    case HttpStatus.UNAUTHORIZED:
      return UnauthorizedErrorCode.INVALID_CREDENTIALS;
    case HttpStatus.FORBIDDEN:
      return ForbiddenErrorCode.FORBIDDEN_RESOURCE;
    case HttpStatus.NOT_FOUND:
      return NotFoundErrorCode.RESOURCE_NOT_FOUND;
    case HttpStatus.CONFLICT:
      return ConflictErrorCode.RESOURCE_CONFLICT;
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return UnprocessableEntityErrorCode.VALIDATION_FAILED;
    case HttpStatus.TOO_MANY_REQUESTS:
      return TooManyRequestsErrorCode.RATE_LIMIT_EXCEEDED;
    case HttpStatus.INTERNAL_SERVER_ERROR:
    default:
      return InternalServerErrorCode.INTERNAL_SERVER_ERROR;
  }
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export const ApiErrorResponse = (
  statusCode: HttpStatus,
  ...statusKeys: ErrorStatusKey[]
) => {
  const status = HttpStatus[statusCode]
    .split('_')
    .map((s) => capitalize(s))
    .join(' ');

  return ApiResponseBase({
    status: statusCode,
    description: HttpStatus[statusCode],
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: statusCode,
        },
        statusKey: {
          type: 'number',
          enum: statusKeys,
          description: 'Structured error status key',
        },
        message: {
          type: 'string',
          example: '',
          description: 'Currently empty, will be removed in future versions',
        },
        error: {
          type: 'string',
          example: status,
        },
      },
      example: {
        statusCode: statusCode,
        statusKey: statusKeys[0],
        message: '',
        error: status,
      },
    },
  });
};

export const ApiResponse = (
  statusCode: HttpStatus,
  ...message: (string | ErrorExpandedDesc)[]
) => {
  const status = HttpStatus[statusCode]
    .split('_')
    .map((s) => capitalize(s))
    .join(' ');

  const [enumValues, objArr] = message.reduce<[string[], ErrorExpandedDesc[]]>(
    ([enumArr, objArr], i) => {
      if ((i as ErrorExpandedDesc).key) {
        objArr.push(i as ErrorExpandedDesc);
      } else {
        enumArr.push(i as string);
      }

      return [enumArr, objArr];
    },
    [[], []],
  );

  if (enumValues.length === 0 && objArr.length === 0) {
    return ApiResponseBase({
      status: statusCode,
      description: HttpStatus[statusCode],
    });
  }

  if (enumValues.length && !objArr.length) {
    return ApiResponseBase({
      status: statusCode,
      description: HttpStatus[statusCode],
      schema: enumResponseSchema(enumValues, status, statusCode),
    });
  }

  if (objArr.length && !enumValues.length) {
    return ApiResponseBase({
      status: statusCode,
      description: HttpStatus[statusCode],
      schema: objectResponseSchema(objArr, status, statusCode),
    });
  }

  const schemas: (SchemaObject & Partial<ReferenceObject>)[] = [];

  if (enumValues.length) {
    schemas.push(enumResponseSchema(enumValues, status, statusCode));
  }

  if (objArr.length) {
    schemas.push(objectResponseSchema(objArr, status, statusCode));
  }

  return ApiResponseBase({
    status: statusCode,
    description: HttpStatus[statusCode],
    schema: {
      oneOf: schemas,
    },
  });
};

function objectResponseSchema(
  objArr: ErrorExpandedDesc[],
  status: string,
  statusCode: HttpStatus,
): SchemaObject & Partial<ReferenceObject> {
  const statusKey = getDefaultStatusKey(statusCode);

  return {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusKey: {
        type: 'number',
        description: 'Structured error status key',
      },
      message: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: 'Entity identifier or some key to determine object',
          },
          description: {
            type: 'string',
            enum: objArr.map((v) => v.description),
            description: 'Error description based on {key}',
          },
        },
      },
      error: {
        type: 'string',
      },
    },
    example: {
      statusCode: statusCode,
      statusKey: statusKey,
      message: objArr[0],
      error: status,
    },
  };
}

function enumResponseSchema(
  enumValues: string[],
  status: string,
  statusCode: HttpStatus,
): SchemaObject & Partial<ReferenceObject> {
  const statusKey = getDefaultStatusKey(statusCode);

  return {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
      },
      statusKey: {
        type: 'number',
        description: 'Structured error status key',
      },
      message: {
        type: 'string',
        enum: enumValues,
        description: 'Key described error',
      },
      error: {
        type: 'string',
      },
    },
    example: {
      statusCode: statusCode,
      statusKey: statusKey,
      message: enumValues[0],
      error: status,
    },
  };
}
