import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { BadRequestErrorCode, UnprocessableEntityErrorCode } from '../error-codes';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const exceptionResponse = exception.getResponse() as any;

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      Array.isArray(exceptionResponse.message)
    ) {
      response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        statusKey: UnprocessableEntityErrorCode.VALIDATION_FAILED,
        message: '',
        error: '',
        validationErrors: exceptionResponse.message,
      });
    } else {
      response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        statusKey: BadRequestErrorCode.INVALID_REQUEST,
        message: '',
        error: '',
      });
    }
  }
}
