import { ApiProperty } from '@nestjs/swagger';
import {
  ErrorStatusKey,
  NotFoundErrorCode,
} from '../error-codes';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({
    description: 'Structured error status key',
    example: NotFoundErrorCode.USER_NOT_FOUND,
  })
  statusKey: ErrorStatusKey;

  @ApiProperty({ example: '' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
