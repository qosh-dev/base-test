import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { IFindPaginationBase } from '../types/interfaces/find-many-base.interface';

export class PaginationBaseDto implements IFindPaginationBase {
  @ApiProperty({
    description: 'Records page',
    required: false,
  })
  @Expose()
  @Transform((t) => {
    const v = Number(t.value);
    return Number.isNaN(v) ? 1 : v;
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Records limit per page',
    required: false,
  })
  @Expose()
  @Transform((t) => {
    const v = Number(t.value);
    return Number.isNaN(v) ? 10 : v;
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
