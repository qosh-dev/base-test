import { Injectable } from '@nestjs/common';
import {
  Validate,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUuidArrayValidator implements ValidatorConstraintInterface {
  validate(value: string[] | string, _args: ValidationArguments): boolean {
    const arr = Array.isArray(value) ? value : value.split(',');
    return arr.every((v) => UUID_REGEX.test(v.trim()));
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of UUIDs`;
  }
}

export const IsUuidArray = (validationOptions?: ValidationOptions) =>
  Validate(IsUuidArrayValidator, validationOptions);
