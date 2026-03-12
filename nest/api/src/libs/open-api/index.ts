// Основной декоратор
export {
  ApiResponses,
  ApiResponsesConfig,
  SuccessResponse,
} from './decorators/api-responses.decorator';

// Утилиты для работы с валидациями
export {
  extractValidationErrors,
  getValidationErrorCodes,
  generateValidationErrorExamples,
  createValidationErrorSchema,
} from './utils/validation-extractor';

// Константы валидации
export {
  VALIDATION_TO_ERROR_CODE,
  VALIDATION_DESCRIPTIONS,
} from './utils/validation.consts';

// Дополнительные декораторы
export { ApiEndpoint } from './decorators/api-endpoint.decorator';
export { ApiErrorResponse as ApiAllErrorResponses } from './decorators/api-error-response.decorator';
export {
  ApiResponse,
  ApiErrorResponse,
} from './decorators/api-response.decorator';
export { WithValidationErrors } from './decorators/with-validation-errors.decorator';
