import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus } from '../../../libs/dto/get-paginated-base.dto';

export interface ICreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
}

export class CreateTaskDto implements ICreateTaskDto {
  @ApiProperty({ type: String, example: 'Buy milk', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ type: String, example: 'Buy milk in supermarket', description: 'Optional task description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.pending, description: 'Task status' })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
