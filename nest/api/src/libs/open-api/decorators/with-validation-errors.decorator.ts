import { Type } from '@nestjs/common';
import { getValidationErrorCodes } from '../utils/validation-extractor';
import { UnprocessableEntityErrorCode } from '../../validation/error-codes';

/**
 * Декоратор для автоматического добавления валидационных ошибок в ApiResponses
 */
export function WithValidationErrors(dtoClass: Type<any>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const validationErrorCodes = getValidationErrorCodes(dtoClass);

    Reflect.defineMetadata(
      'validation-error-codes',
      validationErrorCodes,
      target,
      propertyKey,
    );

    return descriptor;
  };
}

/**
 * Получает коды валидационных ошибок из метаданных метода
 */
export function getValidationErrorCodesFromMethod(
  target: any,
  propertyKey: string,
): UnprocessableEntityErrorCode[] {
  return (
    Reflect.getMetadata('validation-error-codes', target, propertyKey) || []
  );
}
