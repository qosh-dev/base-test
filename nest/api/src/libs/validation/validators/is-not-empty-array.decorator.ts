import { Injectable } from '@nestjs/common';
import {
    Validate,
    type ValidationArguments,
    type ValidationOptions,
    ValidatorConstraint,
    type ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
class IsNotEmptyArrayValidator implements ValidatorConstraintInterface {
  validate(value: string[], _args: ValidationArguments): boolean {
    return Array.isArray(value) && value.length >= 1;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be at least one item`;
  }
}

export const IsNotEmptyArray = (validationOptions?: ValidationOptions) =>
  Validate(IsNotEmptyArrayValidator, validationOptions);
