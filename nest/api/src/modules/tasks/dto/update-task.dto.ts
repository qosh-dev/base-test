import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskStatus } from '../../../libs/dto/get-paginated-base.dto';
import { ICreateTaskDto, CreateTaskDto } from './create-task.dto';

export interface IUpdateTaskDto extends Partial<ICreateTaskDto> {}

export class UpdateTaskDto extends PartialType(CreateTaskDto) implements IUpdateTaskDto {
  @ApiPropertyOptional({ type: String, example: 'Updated task title' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ type: String, example: 'Updated description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.done })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
