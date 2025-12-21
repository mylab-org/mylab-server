import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUniversityEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUniversityEmail',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!value) return false;
          const domain = value.split('@')[1]?.toLowerCase();
          if (!domain) return false;
          return domain.endsWith('.edu') || domain.endsWith('.ac.kr');
        },
        defaultMessage() {
          return '학교 이메일만 사용 가능합니다 (.edu 또는 .ac.kr)';
        },
      },
    });
  };
}
