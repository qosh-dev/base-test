import { UnprocessableEntityErrorCode } from 'src/libs/validation/error-codes.const';

export const VALIDATION_TO_ERROR_CODE: Record<
  string,
  UnprocessableEntityErrorCode
> = {
  // Обязательные поля
  isDefined: UnprocessableEntityErrorCode.FIELD_REQUIRED,
  isNotEmpty: UnprocessableEntityErrorCode.FIELD_NOT_EMPTY,

  // Строки
  isString: UnprocessableEntityErrorCode.INVALID_STRING,
  minLength: UnprocessableEntityErrorCode.STRING_TOO_SHORT,
  maxLength: UnprocessableEntityErrorCode.STRING_TOO_LONG,
  length: UnprocessableEntityErrorCode.INVALID_STRING_LENGTH,

  // Числа
  isNumber: UnprocessableEntityErrorCode.INVALID_NUMBER,
  isInt: UnprocessableEntityErrorCode.INVALID_INTEGER,
  isNumberString: UnprocessableEntityErrorCode.INVALID_NUMBER_STRING,
  min: UnprocessableEntityErrorCode.NUMBER_TOO_SMALL,
  max: UnprocessableEntityErrorCode.NUMBER_TOO_LARGE,
  isPositive: UnprocessableEntityErrorCode.INVALID_POSITIVE,
  isNegative: UnprocessableEntityErrorCode.INVALID_NEGATIVE,

  // Email и контакты
  isEmail: UnprocessableEntityErrorCode.INVALID_EMAIL,
  isPhoneNumber: UnprocessableEntityErrorCode.INVALID_PHONE,
  isUrl: UnprocessableEntityErrorCode.INVALID_URL,

  // Даты
  isDate: UnprocessableEntityErrorCode.INVALID_DATE,
  isDateString: UnprocessableEntityErrorCode.INVALID_DATE_STRING,

  // Булевы значения
  isBoolean: UnprocessableEntityErrorCode.INVALID_BOOLEAN,

  // Enum и выбор
  isEnum: UnprocessableEntityErrorCode.INVALID_ENUM_VALUE,
  isIn: UnprocessableEntityErrorCode.INVALID_CHOICE,

  // Массивы
  isArray: UnprocessableEntityErrorCode.INVALID_ARRAY,
  arrayMinSize: UnprocessableEntityErrorCode.ARRAY_TOO_SHORT,
  arrayMaxSize: UnprocessableEntityErrorCode.ARRAY_TOO_LONG,

  // JSON и объекты
  isJSON: UnprocessableEntityErrorCode.INVALID_JSON,
  isObject: UnprocessableEntityErrorCode.INVALID_OBJECT,

  // UUID и идентификаторы
  isUUID: UnprocessableEntityErrorCode.INVALID_UUID,
};

export const VALIDATION_DESCRIPTIONS: Record<string, string> = {
  // Обязательные поля
  isDefined: 'Поле обязательно для заполнения',
  isNotEmpty: 'Поле не может быть пустым',

  // Строки
  isString: 'Поле должно быть строкой',
  minLength: 'Строка слишком короткая',
  maxLength: 'Строка слишком длинная',
  length: 'Неверная длина строки',

  // Числа
  isNumber: 'Поле должно быть числом',
  isInt: 'Поле должно быть целым числом',
  isNumberString: 'Поле должно быть строкой, содержащей число',
  min: 'Значение слишком маленькое',
  max: 'Значение слишком большое',
  isPositive: 'Значение должно быть положительным',
  isNegative: 'Значение должно быть отрицательным',

  // Email и контакты
  isEmail: 'Неверный формат email',
  isPhoneNumber: 'Неверный формат номера телефона',
  isUrl: 'Неверный формат URL',

  // Даты
  isDate: 'Неверный формат даты',
  isDateString: 'Неверный формат строки даты',

  // Булевы значения
  isBoolean: 'Поле должно быть булевым значением',

  // Enum и выбор
  isEnum: 'Недопустимое значение для перечисления',
  isIn: 'Значение не входит в список допустимых',

  // Массивы
  isArray: 'Поле должно быть массивом',
  arrayMinSize: 'Массив слишком короткий',
  arrayMaxSize: 'Массив слишком длинный',

  // JSON и объекты
  isJSON: 'Неверный формат JSON',
  isObject: 'Поле должно быть объектом',

  // UUID и идентификаторы
  isUUID: 'Неверный формат UUID',
};
