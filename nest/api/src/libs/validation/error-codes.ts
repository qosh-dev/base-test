/**
 * Система кодов ошибок
 * Формат: XXYYYY где XX - HTTP статус код, YYYY - уникальный код ошибки
 */

import { HttpException } from '@nestjs/common';
import {
  BadRequestErrorCode,
  UnauthorizedErrorCode,
  ForbiddenErrorCode,
  NotFoundErrorCode,
  ConflictErrorCode,
  UnprocessableEntityErrorCode,
  TooManyRequestsErrorCode,
  InternalServerErrorCode,
} from './error-codes.const';

// Реэкспорт enum'ов для использования в других модулях
export {
  BadRequestErrorCode,
  UnauthorizedErrorCode,
  ForbiddenErrorCode,
  NotFoundErrorCode,
  ConflictErrorCode,
  UnprocessableEntityErrorCode,
  TooManyRequestsErrorCode,
  InternalServerErrorCode,
};

// Union type для всех кодов ошибок
export type ErrorStatusKey =
  | BadRequestErrorCode
  | UnauthorizedErrorCode
  | ForbiddenErrorCode
  | NotFoundErrorCode
  | ConflictErrorCode
  | UnprocessableEntityErrorCode
  | TooManyRequestsErrorCode
  | InternalServerErrorCode;

export interface ApiErrorResponse {
  statusCode: number;
  statusKey: ErrorStatusKey;
  message: string;
  error: string;
  field?: string;
  constraint?: string;
  description?: string;
}

export class ApiError extends HttpException {
  public readonly statusKey: ErrorStatusKey;
  public readonly field?: string;
  public readonly constraint?: string;
  public readonly description?: string;

  constructor(
    statusKey: ErrorStatusKey,
    options?: {
      field?: string;
      constraint?: string;
      description?: string;
    },
  ) {
    const statusCode = Math.floor(statusKey / 1000);
    const errorResponse = {
      statusCode,
      statusKey,
      message: '',
      error: '',
      ...(options?.field && { field: options.field }),
      ...(options?.constraint && { constraint: options.constraint }),
      ...(options?.description && { description: options.description }),
    };

    super(errorResponse, statusCode);
    this.name = 'ApiError';
    this.statusKey = statusKey;
    this.field = options?.field;
    this.constraint = options?.constraint;
    this.description = options?.description;
  }

  toResponse(): ApiErrorResponse {
    const response: ApiErrorResponse = {
      statusCode: this.getStatus(),
      statusKey: this.statusKey,
      message: '',
      error: '',
    };

    if (this.field) response.field = this.field;
    if (this.constraint) response.constraint = this.constraint;
    if (this.description) response.description = this.description;

    return response;
  }
}

/**
 * Создает валидационную ошибку с деталями поля
 */
export class ValidationApiError extends ApiError {
  constructor(
    statusKey: UnprocessableEntityErrorCode,
    field: string,
    constraint: string,
    description: string,
  ) {
    super(statusKey, { field, constraint, description });
  }
}
