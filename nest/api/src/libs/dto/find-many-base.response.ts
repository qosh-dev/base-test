import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export interface IFindManyResponseBase<T> {
  page: number;
  total: number;
  limit: number;
  items: T[];
}

export class FindManyResponseBase<T> implements IFindManyResponseBase<T> {
  @ApiProperty({ type: Number, example: 1 })
  page: number;

  @ApiProperty({ type: Number, example: 10 })
  total: number;

  @ApiProperty({ type: Number, example: 10 })
  limit: number;

  @ApiProperty({ isArray: true })
  items: T[];

  static serialize<T>(data: IFindManyResponseBase<T>): FindManyResponseBase<T> {
    return data;
  }

  static apiSchema<TModel extends Type<unknown>>(model: TModel, name?: string) {
    class FindManyResponseDto {
      @ApiProperty({ type: Number, example: 1 })
      page: number;

      @ApiProperty({ type: Number, example: 10 })
      total: number;

      @ApiProperty({ type: Number, example: 10 })
      limit: number;

      @ApiProperty({ type: model, isArray: true })
      items: InstanceType<TModel>[];
    }

    Object.defineProperty(FindManyResponseDto, 'name', {
      value: name ? `FindMany${name}` : `FindMany${model.name}`,
    });

    return FindManyResponseDto;
  }
}
