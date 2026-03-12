import { ApiProperty } from '@nestjs/swagger';

export interface IRecordStringResponse {
  data: Record<string, string>;
}

export class RecordStringResponse implements IRecordStringResponse {
  @ApiProperty({
    description: 'Key-value map of string pairs',
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { key: 'value', another: 'entry' },
  })
  data: Record<string, string>;
}
