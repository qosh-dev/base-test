import { ApiProperty } from '@nestjs/swagger';

export class ErrorCodeInfo {
  @ApiProperty({
    description: 'Числовой код ошибки',
    example: 400001,
  })
  code: number;

  @ApiProperty({
    description: 'Название кода ошибки',
    example: 'INVALID_REQUEST',
  })
  name: string;

  @ApiProperty({
    description: 'Описание ошибки',
    example: 'Неверный запрос',
  })
  description: string;
}

export class ErrorCodesByStatus {
  @ApiProperty({
    description: 'HTTP статус код',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Название HTTP статуса',
    example: 'Bad Request',
  })
  statusName: string;

  @ApiProperty({
    description: 'Список кодов ошибок для данного статуса',
    type: [ErrorCodeInfo],
  })
  errorCodes: ErrorCodeInfo[];
}

export class ErrorCodesRegistryResponse {
  @ApiProperty({
    description: 'Реестр всех кодов ошибок, сгруппированных по HTTP статусам',
    type: [ErrorCodesByStatus],
  })
  errorCodes: ErrorCodesByStatus[];

  @ApiProperty({
    description: 'Общее количество кодов ошибок',
    example: 24,
  })
  totalCodes: number;

  @ApiProperty({
    description: 'Дата последнего обновления реестра',
    example: '2025-09-12T10:30:00.000Z',
  })
  lastUpdated: string;
}
