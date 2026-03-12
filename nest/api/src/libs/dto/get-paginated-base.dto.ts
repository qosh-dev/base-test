import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum TaskStatus {
  pending = 'pending',
  done = 'done',
}

export interface IGetPaginatedBaseDto {
  page?: number;
  limit?: number;
  status?: TaskStatus;
}

export class GetPaginatedBaseDto implements IGetPaginatedBaseDto {
  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ type: Number, example: 10, default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.pending })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
