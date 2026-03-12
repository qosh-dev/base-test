import { Type } from '@nestjs/common';
import 'reflect-metadata';
import { getMetadataStorage } from 'class-validator';
import {
  VALIDATION_TO_ERROR_CODE,
  VALIDATION_DESCRIPTIONS,
} from './validation.consts';
import { UnprocessableEntityErrorCode } from 'src/libs/validation/error-codes.const';

export interface ValidationErrorInfo {
  field: string;
  constraint: string;
  errorCode: UnprocessableEntityErrorCode;
  description: string;
}

export function extractValidationErrors(
  dtoClass: Type<any>,
): ValidationErrorInfo[] {
  try {
    const metadataStorage = getMetadataStorage();
    const validationMetadatas: any[] =
      metadataStorage.getTargetValidationMetadatas(dtoClass, '', false, false);

    const validationErrors: ValidationErrorInfo[] = [];
    const seenConstraints = new Set<string>();

    for (const metadata of validationMetadatas) {
      const constraint = metadata.name as string;
      const field = metadata.propertyName;

      const constraintKey = `${field}-${constraint}`;
      if (seenConstraints.has(constraintKey)) {
        continue;
      }
      seenConstraints.add(constraintKey);

      const errorCode = VALIDATION_TO_ERROR_CODE[constraint];
      const description = VALIDATION_DESCRIPTIONS[constraint];

      if (errorCode && description) {
        validationErrors.push({
          field,
          constraint,
          errorCode,
          description: `${field}: ${description}`,
        });
      }
    }

    return validationErrors;
  } catch (error) {
    console.warn('Failed to extract validation errors:', error);
    return [];
  }
}

export function getValidationErrorCodes(
  dtoClass: Type<any>,
): UnprocessableEntityErrorCode[] {
  const validationErrors = extractValidationErrors(dtoClass);
  const uniqueCodes = new Set<UnprocessableEntityErrorCode>();

  for (const error of validationErrors) {
    uniqueCodes.add(error.errorCode);
  }

  if (uniqueCodes.size === 0) {
    uniqueCodes.add(UnprocessableEntityErrorCode.VALIDATION_FAILED);
  }

  return Array.from(uniqueCodes);
}

export function generateValidationErrorExamples(dtoClass: Type<any>) {
  const validationErrors = extractValidationErrors(dtoClass);

  const examples: Record<string, any> = {};

  for (const error of validationErrors) {
    const exampleName = `${error.field}_${error.constraint}`;
    examples[exampleName] = {
      summary: error.description,
      value: {
        statusCode: 422,
        statusKey: error.errorCode,
        message: '',
        error: 'Unprocessable Entity',
        field: error.field,
        constraint: error.constraint,
        description: error.description,
      },
    };
  }

  return examples;
}

export function createValidationErrorSchema(dtoClass: Type<any>) {
  const validationErrors = extractValidationErrors(dtoClass);
  const uniqueCodes = getValidationErrorCodes(dtoClass);

  const fieldExamples: Record<string, any> = {};
  for (const error of validationErrors) {
    if (!fieldExamples[error.field]) {
      fieldExamples[error.field] = [];
    }
    fieldExamples[error.field].push({
      constraint: error.constraint,
      errorCode: error.errorCode,
      description:
        VALIDATION_DESCRIPTIONS[error.constraint] || 'Validation error',
    });
  }

  return {
    type: 'object',
    properties: {
      statusCode: {
        type: 'number',
        example: 422,
        description: 'HTTP status code',
      },
      statusKey: {
        type: 'number',
        enum: uniqueCodes,
        description: 'Structured error status key for validation errors',
      },
      message: {
        type: 'string',
        example: '',
      },
      error: {
        type: 'string',
        example: 'Unprocessable Entity',
      },
      field: {
        type: 'string',
        enum: [...new Set(validationErrors.map((e) => e.field))],
        description: 'Field that caused the validation error',
      },
      constraint: {
        type: 'string',
        enum: [...new Set(validationErrors.map((e) => e.constraint))],
        description: 'Validation constraint that failed',
      },
      description: {
        type: 'string',
        description: 'Human-readable error description',
      },
    },
    examples: generateValidationErrorExamples(dtoClass),
  };
}
