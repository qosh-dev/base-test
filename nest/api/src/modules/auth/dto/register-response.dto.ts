import { ApiProperty } from '@nestjs/swagger';

export interface IRegisterResponseDto {
  id: string;
  email: string;
  created_at: string;
}

export class RegisterResponseDto implements IRegisterResponseDto {
  @ApiProperty({ type: String, format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ type: String, example: 'user@test.com' })
  email: string;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-03-12T10:00:00.000Z' })
  created_at: string;
}
