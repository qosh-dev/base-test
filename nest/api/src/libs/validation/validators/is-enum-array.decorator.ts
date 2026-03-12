import {
  ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsEnumArrayValidator implements ValidatorConstraintInterface {
  validate(value: string[], args: ValidationArguments): boolean {
    const enumType = args.constraints[0];
    return Array.isArray(value) && value.every((v) => enumType(v));
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of enum`;
  }
}

export function IsEnumArray(
  type: object,
  validationOptions?: ValidationOptions,
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: (object as any).constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [type],
      validator: IsEnumArrayValidator,
    });
  };
}
