import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export interface IIdStringDto {
  id: string;
}

export class IdStringDto implements IIdStringDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier',
  })
  @IsUUID('4')
  id: string;
}
