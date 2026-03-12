import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { ApiResponses } from './api-responses.decorator';
import {
    UnauthorizedErrorCode,
    ForbiddenErrorCode,
    BadRequestErrorCode,
} from '../../validation/error-codes';

export interface ApiEndpointConfig<TDto = any, TResponse = any> {
  operation: {
    summary: string;
    description?: string;
  };
  auth?: {
    required?: boolean;
    roles?: string[];
  };
  body?: Type<TDto>;
  response: {
    model: Type<TResponse>;
    isArray?: boolean;
    description?: string;
  };
  additionalErrors?: {
    [status: number]: any[];
  };
}

export const ApiEndpoint = <TDto = any, TResponse = any>(
  config: ApiEndpointConfig<TDto, TResponse>,
) => {
  const decorators: any[] = [];

  decorators.push(ApiOperation(config.operation));

  if (config.body) {
    decorators.push(ApiBody({ type: config.body }));
  }

  const responsesConfig: any = {
    [HttpStatus.OK]: {
      model: config.response.model,
      isArray: config.response.isArray || false,
      description: config.response.description || 'Success',
    },
  };

  if (config.auth?.required !== false) {
    responsesConfig[HttpStatus.UNAUTHORIZED] = [
      UnauthorizedErrorCode.INVALID_CREDENTIALS,
      UnauthorizedErrorCode.TOKEN_EXPIRED,
      UnauthorizedErrorCode.TOKEN_INVALID,
    ];

    if (config.auth?.roles?.length) {
      responsesConfig[HttpStatus.FORBIDDEN] = [
        ForbiddenErrorCode.FORBIDDEN_RESOURCE,
        ForbiddenErrorCode.INSUFFICIENT_PERMISSIONS,
      ];
    }
  }

  if (config.body) {
    responsesConfig[HttpStatus.BAD_REQUEST] = [
      BadRequestErrorCode.INVALID_REQUEST,
      BadRequestErrorCode.MISSING_REQUIRED_FIELD,
      BadRequestErrorCode.INVALID_FORMAT,
    ];

    responsesConfig.autoValidationErrors = config.body;
  }

  if (config.additionalErrors) {
    Object.assign(responsesConfig, config.additionalErrors);
  }

  decorators.push(ApiResponses(responsesConfig));

  return applyDecorators(...decorators);
};

export const ApiPatchEndpoint = <TDto = any, TResponse = any>(
  summary: string,
  bodyDto: Type<TDto>,
  responseModel: Type<TResponse>,
  additionalErrors?: { [status: number]: any[] },
) => {
  return ApiEndpoint({
    operation: { summary },
    body: bodyDto,
    response: { model: responseModel },
    auth: { required: true, roles: ['admin'] },
    additionalErrors,
  });
};
