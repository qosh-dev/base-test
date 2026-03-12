import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';

@Exclude()
export class IdNumberDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsDefined()
  @Expose()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id: number;
}
