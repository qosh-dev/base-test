import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../libs/dto/get-paginated-base.dto';

export interface ITaskResponseDto {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export class TaskResponseDto implements ITaskResponseDto {
  @ApiProperty({ type: String, format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ type: String, format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' })
  user_id: string;

  @ApiProperty({ type: String, example: 'Buy milk' })
  title: string;

  @ApiProperty({ type: String, example: 'Buy milk in supermarket', nullable: true })
  description: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.pending })
  status: TaskStatus;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-03-12T10:00:00.000Z' })
  created_at: string;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-03-12T10:05:00.000Z' })
  updated_at: string;
}
