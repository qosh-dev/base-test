import { BadRequestErrorCode, UnprocessableEntityErrorCode } from './error-codes';

export function getValidationErrorCodes(): BadRequestErrorCode[] {
  return [
    BadRequestErrorCode.INVALID_REQUEST,
    BadRequestErrorCode.MISSING_REQUIRED_FIELD,
    BadRequestErrorCode.INVALID_FORMAT,
  ];
}

export function getUnprocessableEntityErrorCodes(): UnprocessableEntityErrorCode[] {
  return [
    UnprocessableEntityErrorCode.VALIDATION_FAILED,
    UnprocessableEntityErrorCode.INVALID_DATA_FORMAT,
  ];
}

export function shouldIncludeValidationErrors(method: string): boolean {
  const methodsWithBody = ['POST', 'PATCH', 'PUT'];
  return methodsWithBody.includes(method.toUpperCase());
}
