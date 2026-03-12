import {
	ArgumentsHost,
	Catch,
	HttpException,
	HttpStatus,
	ExceptionFilter as NestExceptionFilter,
	Logger as NestLogger,
	UnprocessableEntityException,
	ValidationPipe,
} from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';
import process from 'process';
import { NodeEnv } from 'src/config/config.consts';
import { Envs } from 'src/config/config.module';
import { ApiError, ErrorStatusKey } from '../error-codes';
import {
	BadRequestErrorCode,
	ConflictErrorCode,
	ForbiddenErrorCode,
	InternalServerErrorCode,
	NotFoundErrorCode,
	TooManyRequestsErrorCode,
	UnauthorizedErrorCode,
	UnprocessableEntityErrorCode,
} from '../error-codes.const';

export class ExceptionFilter {
	static logger: NestLogger = new NestLogger(ExceptionFilter.name);

	static provide(app: NestFastifyApplication) {
		app.useGlobalPipes(ExceptionFilter.validationFilter());

		const isProduction = Envs.NODE_ENV === NodeEnv.production;

		@Catch()
		class AllFilter implements NestExceptionFilter {
			private getStatusKeyFromHttpStatus(status: number): ErrorStatusKey {
				switch (status) {
					case 400:
						return BadRequestErrorCode.INVALID_REQUEST;
					case 401:
						return UnauthorizedErrorCode.INVALID_CREDENTIALS;
					case 403:
						return ForbiddenErrorCode.FORBIDDEN_RESOURCE;
					case 404:
						return NotFoundErrorCode.RESOURCE_NOT_FOUND;
					case 409:
						return ConflictErrorCode.RESOURCE_CONFLICT;
					case 422:
						return UnprocessableEntityErrorCode.VALIDATION_FAILED;
					case 429:
						return TooManyRequestsErrorCode.RATE_LIMIT_EXCEEDED;
					default:
						return InternalServerErrorCode.INTERNAL_SERVER_ERROR;
				}
			}

			async catch(exc: Error, host: ArgumentsHost) {
				const ctx = host.switchToHttp();
				const req = ctx.getRequest();
				const res = ctx.getResponse();

				const status =
					exc instanceof HttpException ? exc.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

				let message: any;

				if (exc instanceof ApiError) {
					message = exc.toResponse();
				} else if (exc instanceof HttpException) {
					const response = exc.getResponse();

					if (
						typeof response === 'object' &&
						response !== null &&
						'statusKey' in response &&
						'field' in response
					) {
						message = response;
					} else if (
						typeof response === 'object' &&
						response !== null &&
						Array.isArray((response as any).message)
					) {
						message = {
							statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
							statusKey: UnprocessableEntityErrorCode.VALIDATION_FAILED,
							message: '',
							error: 'Unprocessable Entity',
							validationErrors: (response as any).message,
						};
					} else {
						message = {
							statusCode: status,
							statusKey: this.getStatusKeyFromHttpStatus(status),
							message: '',
							error: exc.message,
						};
					}
				} else {
					message = {
						statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
						statusKey: InternalServerErrorCode.INTERNAL_SERVER_ERROR,
						message: '',
						error: 'Internal server error',
					};
				}

				if (status === 429) {
					message = {
						statusCode: HttpStatus.TOO_MANY_REQUESTS,
						statusKey: TooManyRequestsErrorCode.RATE_LIMIT_EXCEEDED,
						message: '',
						error: 'Too Many Requests',
					};
				}

				if (status > 400) {
					ExceptionFilter.logger.error(
						`HTTP ${status} ${req.method} ${req.url} — ${JSON.stringify(message)}`,
						exc.stack,
					);
				}
				if (status >= 500) {
					console.error(`Critical error occurred: ${exc.message}`, {
						exc,
						status,
						message,
					});
				}

				res.status(status).send(message);
			}
		}

		app.useGlobalFilters(new AllFilter());

		if (process) {
			process.on('uncaughtException', async (error) => {
				if (!isProduction) {
					return;
				}

				ExceptionFilter.logger.error(error.message, error.stack);
				console.error(`❌ UNCAUGHT Exception\n${error.stack}`);
				process.exit(1);
			});
		}
	}

	static validationFilter() {
		return new ValidationPipe({
			transform: true,
			exceptionFactory(errors: ValidationError[]) {
				const error = errors[0];
				if (!error.constraints) {
					throw new UnprocessableEntityException();
				}

				const constraintKey = Object.keys(error.constraints)[0];
				const constraintMessage = error.constraints[constraintKey];

				const getValidationErrorCode = (constraint: string): UnprocessableEntityErrorCode => {
					const validationMapping: Record<string, UnprocessableEntityErrorCode> = {
						isDefined: UnprocessableEntityErrorCode.FIELD_REQUIRED,
						isNotEmpty: UnprocessableEntityErrorCode.FIELD_NOT_EMPTY,
						isString: UnprocessableEntityErrorCode.INVALID_STRING,
						isInt: UnprocessableEntityErrorCode.INVALID_INTEGER,
						isNumber: UnprocessableEntityErrorCode.INVALID_NUMBER,
						isNumberString: UnprocessableEntityErrorCode.INVALID_NUMBER_STRING,
						isEmail: UnprocessableEntityErrorCode.INVALID_EMAIL,
						isPhoneNumber: UnprocessableEntityErrorCode.INVALID_PHONE,
						isBoolean: UnprocessableEntityErrorCode.INVALID_BOOLEAN,
						isDate: UnprocessableEntityErrorCode.INVALID_DATE,
						isDateString: UnprocessableEntityErrorCode.INVALID_DATE_STRING,
						isEnum: UnprocessableEntityErrorCode.INVALID_ENUM_VALUE,
						isArray: UnprocessableEntityErrorCode.INVALID_ARRAY,
						isUUID: UnprocessableEntityErrorCode.INVALID_UUID,
						minLength: UnprocessableEntityErrorCode.STRING_TOO_SHORT,
						maxLength: UnprocessableEntityErrorCode.STRING_TOO_LONG,
						min: UnprocessableEntityErrorCode.NUMBER_TOO_SMALL,
						max: UnprocessableEntityErrorCode.NUMBER_TOO_LARGE,
					};

					return validationMapping[constraint] || UnprocessableEntityErrorCode.VALIDATION_FAILED;
				};

				const validationError = new ApiError(getValidationErrorCode(constraintKey), {
					field: error.property,
					constraint: constraintKey,
					description: `${error.property}: ${constraintMessage}`,
				});

				return new UnprocessableEntityException(validationError.toResponse());
			},
		});
	}
}
