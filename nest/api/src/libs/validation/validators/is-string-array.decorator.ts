import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray as IsArrayBase } from 'class-validator';

export const IsStringArray = () =>
  applyDecorators(
    Transform(({ value }) => {
      let arr: string[] = value;
      if (typeof value === 'string') {
        arr = value.split(',').map((item) => item.trim());
      }
      return arr;
    }),
    IsArrayBase(),
  );
