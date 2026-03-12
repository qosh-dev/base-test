import { ApiProperty } from '@nestjs/swagger';

export interface IAuthResponseDto {
  token: string;
}

export class AuthResponseDto implements IAuthResponseDto {
  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  token: string;
}
