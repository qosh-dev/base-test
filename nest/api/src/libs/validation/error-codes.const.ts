// 400 - Bad Request
export enum BadRequestErrorCode {
  INVALID_REQUEST = 400001,
  MISSING_REQUIRED_FIELD = 400002,
  INVALID_FORMAT = 400003
}

// 401 - Unauthorized
export enum UnauthorizedErrorCode {
  INVALID_CREDENTIALS = 401001,
  TOKEN_EXPIRED = 401002,
  TOKEN_INVALID = 401003
}

// 403 - Forbidden
export enum ForbiddenErrorCode {
  FORBIDDEN_RESOURCE = 403001,
  INSUFFICIENT_PERMISSIONS = 403002,
  USER_BLOCKED = 403003
}

// 404 - Not Found
export enum NotFoundErrorCode {
  USER_NOT_FOUND = 404001,
  RESOURCE_NOT_FOUND = 404002,
  ENDPOINT_NOT_FOUND = 404003,
  TASK_NOT_FOUND = 404004
}

// 409 - Conflict
export enum ConflictErrorCode {
  USER_ALREADY_EXISTS = 409001,
  RESOURCE_CONFLICT = 409002,
  RESOURCE_ALREADY_EXISTS = 409003,
  EMAIL_EXISTS = 409006
}

// 422 - Unprocessable Entity (Validation Errors)
export enum UnprocessableEntityErrorCode {
  // Общие ошибки валидации
  VALIDATION_FAILED = 422001,
  INVALID_DATA_FORMAT = 422002,

  // Обязательные поля
  FIELD_REQUIRED = 422010,
  FIELD_NOT_EMPTY = 422011,

  // Строки
  INVALID_STRING = 422020,
  STRING_TOO_SHORT = 422021,
  STRING_TOO_LONG = 422022,
  INVALID_STRING_LENGTH = 422023,

  // Числа
  INVALID_NUMBER = 422030,
  INVALID_INTEGER = 422031,
  INVALID_NUMBER_STRING = 422032,
  NUMBER_TOO_SMALL = 422033,
  NUMBER_TOO_LARGE = 422034,
  INVALID_POSITIVE = 422035,
  INVALID_NEGATIVE = 422036,

  // Email и контакты
  INVALID_EMAIL = 422041,
  INVALID_PHONE = 422042,
  INVALID_URL = 422043,

  // Даты
  INVALID_DATE = 422050,
  INVALID_DATE_STRING = 422051,

  // Булевы значения
  INVALID_BOOLEAN = 422060,

  // Enum и выбор
  INVALID_ENUM_VALUE = 422070,
  INVALID_CHOICE = 422071,

  // Массивы
  INVALID_ARRAY = 422080,
  ARRAY_TOO_SHORT = 422081,
  ARRAY_TOO_LONG = 422082,

  // JSON и объекты
  INVALID_JSON = 422090,
  INVALID_OBJECT = 422091,

  // UUID и идентификаторы
  INVALID_UUID = 422100
}

// 429 - Too Many Requests
export enum TooManyRequestsErrorCode {
  RATE_LIMIT_EXCEEDED = 429001
}

// 500 - Internal Server Error
export enum InternalServerErrorCode {
  INTERNAL_SERVER_ERROR = 500001,
  DATABASE_ERROR = 500002,
  EXTERNAL_SERVICE_ERROR = 500003
}

// -----------------------------------------------------------------------------------------------
// Error descriptions
// -----------------------------------------------------------------------------------------------

export const errorCategoryDescriptions: Record<number, string> = {
  400: "Ошибка запроса",
  401: "Ошибка авторизации",
  403: "Нет доступа",
  404: "Не найдено",
  409: "Конфликт",
  422: "Ошибка валидации",
  429: "Слишком много запросов",
  500: "Ошибка сервера"
};

export const errorSpecificDescriptions: Record<number, string> = {
  [BadRequestErrorCode.INVALID_REQUEST]: "Неверный запрос",
  [BadRequestErrorCode.MISSING_REQUIRED_FIELD]: "Отсутствует обязательное поле",
  [BadRequestErrorCode.INVALID_FORMAT]: "Неверный формат данных",

  [UnauthorizedErrorCode.INVALID_CREDENTIALS]: "Неверные учетные данные",
  [UnauthorizedErrorCode.TOKEN_EXPIRED]: "Токен истек",
  [UnauthorizedErrorCode.TOKEN_INVALID]: "Недействительный токен",

  [ForbiddenErrorCode.FORBIDDEN_RESOURCE]: "Доступ к ресурсу запрещен",
  [ForbiddenErrorCode.INSUFFICIENT_PERMISSIONS]: "Недостаточно прав доступа",
  [ForbiddenErrorCode.USER_BLOCKED]: "Пользователь заблокирован",

  [NotFoundErrorCode.USER_NOT_FOUND]: "Пользователь не найден",
  [NotFoundErrorCode.RESOURCE_NOT_FOUND]: "Ресурс не найден",
  [NotFoundErrorCode.ENDPOINT_NOT_FOUND]: "Эндпоинт не найден",
  [NotFoundErrorCode.TASK_NOT_FOUND]: "Задача не найдена",

  [ConflictErrorCode.USER_ALREADY_EXISTS]: "Пользователь уже существует",
  [ConflictErrorCode.RESOURCE_CONFLICT]: "Конфликт ресурсов",
  [ConflictErrorCode.RESOURCE_ALREADY_EXISTS]: "Ресурс уже существует",
  [ConflictErrorCode.EMAIL_EXISTS]: "Пользователь с таким email уже существует",

  [UnprocessableEntityErrorCode.VALIDATION_FAILED]: "Ошибка валидации",
  [UnprocessableEntityErrorCode.INVALID_DATA_FORMAT]: "Неверный формат данных",
  [UnprocessableEntityErrorCode.FIELD_REQUIRED]:
    "Поле обязательно для заполнения",
  [UnprocessableEntityErrorCode.FIELD_NOT_EMPTY]: "Поле не может быть пустым",
  [UnprocessableEntityErrorCode.INVALID_STRING]: "Поле должно быть строкой",
  [UnprocessableEntityErrorCode.STRING_TOO_SHORT]: "Строка слишком короткая",
  [UnprocessableEntityErrorCode.STRING_TOO_LONG]: "Строка слишком длинная",
  [UnprocessableEntityErrorCode.INVALID_STRING_LENGTH]: "Неверная длина строки",
  [UnprocessableEntityErrorCode.INVALID_NUMBER]: "Поле должно быть числом",
  [UnprocessableEntityErrorCode.INVALID_INTEGER]:
    "Поле должно быть целым числом",
  [UnprocessableEntityErrorCode.INVALID_NUMBER_STRING]:
    "Поле должно быть строкой, содержащей число",
  [UnprocessableEntityErrorCode.NUMBER_TOO_SMALL]: "Значение слишком маленькое",
  [UnprocessableEntityErrorCode.NUMBER_TOO_LARGE]: "Значение слишком большое",
  [UnprocessableEntityErrorCode.INVALID_POSITIVE]:
    "Значение должно быть положительным",
  [UnprocessableEntityErrorCode.INVALID_NEGATIVE]:
    "Значение должно быть отрицательным",
  [UnprocessableEntityErrorCode.INVALID_EMAIL]: "Неверный формат email",
  [UnprocessableEntityErrorCode.INVALID_PHONE]:
    "Неверный формат номера телефона",
  [UnprocessableEntityErrorCode.INVALID_URL]: "Неверный формат URL",
  [UnprocessableEntityErrorCode.INVALID_DATE]: "Неверный формат даты",
  [UnprocessableEntityErrorCode.INVALID_DATE_STRING]:
    "Неверный формат строки даты",
  [UnprocessableEntityErrorCode.INVALID_BOOLEAN]:
    "Поле должно быть булевым значением",
  [UnprocessableEntityErrorCode.INVALID_ENUM_VALUE]:
    "Недопустимое значение для перечисления",
  [UnprocessableEntityErrorCode.INVALID_CHOICE]:
    "Значение не входит в список допустимых",
  [UnprocessableEntityErrorCode.INVALID_ARRAY]: "Поле должно быть массивом",
  [UnprocessableEntityErrorCode.ARRAY_TOO_SHORT]: "Массив слишком короткий",
  [UnprocessableEntityErrorCode.ARRAY_TOO_LONG]: "Массив слишком длинный",
  [UnprocessableEntityErrorCode.INVALID_JSON]: "Неверный формат JSON",
  [UnprocessableEntityErrorCode.INVALID_OBJECT]: "Поле должно быть объектом",
  [UnprocessableEntityErrorCode.INVALID_UUID]: "Неверный формат UUID"
};
