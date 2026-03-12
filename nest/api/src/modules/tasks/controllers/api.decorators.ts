import { Delete, Get, HttpStatus, Post, Put, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { FindManyResponseBase, GetPaginatedBaseDto, IdStringDto } from '../../../libs/dto';
import { ApiResponses } from '../../../libs/open-api';
import { Authorized } from '../../../libs/validation/auth';
import {
  BadRequestErrorCode,
  ForbiddenErrorCode,
  NotFoundErrorCode,
  UnauthorizedErrorCode,
} from '../../../libs/validation/error-codes';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskResponseDto } from '../dto/task-response.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

export const PostCreateTaskApi = () =>
  applyDecorators(
    Post(),
    ApiOperation({
      summary: 'Create task',
      description: 'Create a new task for the authenticated user.',
    }),
    ApiResponses({
      [HttpStatus.CREATED]: { model: TaskResponseDto, description: 'Task created successfully' },
      [HttpStatus.BAD_REQUEST]: [BadRequestErrorCode.INVALID_REQUEST],
      [HttpStatus.UNAUTHORIZED]: [UnauthorizedErrorCode.INVALID_CREDENTIALS],
      autoValidationErrors: CreateTaskDto,
    }),
    Authorized(['user']),
  );

export const GetAllTasksApi = () =>
  applyDecorators(
    Get(),
    ApiOperation({
      summary: 'Get tasks list',
      description: 'Get paginated list of current user tasks with optional status filter.',
    }),
    ApiResponses({
      [HttpStatus.OK]: {
        model: FindManyResponseBase.apiSchema(TaskResponseDto),
        description: 'Tasks retrieved successfully',
      },
      [HttpStatus.BAD_REQUEST]: [BadRequestErrorCode.INVALID_REQUEST],
      [HttpStatus.UNAUTHORIZED]: [UnauthorizedErrorCode.INVALID_CREDENTIALS],
      autoValidationErrors: GetPaginatedBaseDto,
    }),
    Authorized(['user']),
  );

export const GetByIdTaskApi = () =>
  applyDecorators(
    Get(':id'),
    ApiOperation({
      summary: 'Get task by ID',
      description: 'Get a single task owned by the authenticated user.',
    }),
    ApiResponses({
      [HttpStatus.OK]: { model: TaskResponseDto, description: 'Task retrieved successfully' },
      [HttpStatus.BAD_REQUEST]: [BadRequestErrorCode.INVALID_REQUEST],
      [HttpStatus.UNAUTHORIZED]: [UnauthorizedErrorCode.INVALID_CREDENTIALS],
      [HttpStatus.FORBIDDEN]: [ForbiddenErrorCode.INSUFFICIENT_PERMISSIONS],
      [HttpStatus.NOT_FOUND]: [NotFoundErrorCode.RESOURCE_NOT_FOUND],
      autoValidationErrors: IdStringDto,
    }),
    Authorized(['user']),
  );

export const PutUpdateTaskApi = () =>
  applyDecorators(
    Put(':id'),
    ApiOperation({
      summary: 'Update task',
      description: 'Update title, description, or status of an existing task.',
    }),
    ApiResponses({
      [HttpStatus.OK]: { model: TaskResponseDto, description: 'Task updated successfully' },
      [HttpStatus.BAD_REQUEST]: [BadRequestErrorCode.INVALID_REQUEST],
      [HttpStatus.UNAUTHORIZED]: [UnauthorizedErrorCode.INVALID_CREDENTIALS],
      [HttpStatus.FORBIDDEN]: [ForbiddenErrorCode.INSUFFICIENT_PERMISSIONS],
      [HttpStatus.NOT_FOUND]: [NotFoundErrorCode.RESOURCE_NOT_FOUND],
      autoValidationErrors: UpdateTaskDto,
    }),
    Authorized(['user']),
  );

export const DeleteTaskApi = () =>
  applyDecorators(
    Delete(':id'),
    ApiOperation({
      summary: 'Soft delete task',
      description: 'Soft delete a task belonging to the authenticated user.',
    }),
    ApiResponses({
      [HttpStatus.OK]: { description: 'Task deleted successfully' },
      [HttpStatus.BAD_REQUEST]: [BadRequestErrorCode.INVALID_REQUEST],
      [HttpStatus.UNAUTHORIZED]: [UnauthorizedErrorCode.INVALID_CREDENTIALS],
      [HttpStatus.FORBIDDEN]: [ForbiddenErrorCode.INSUFFICIENT_PERMISSIONS],
      [HttpStatus.NOT_FOUND]: [NotFoundErrorCode.RESOURCE_NOT_FOUND],
      autoValidationErrors: IdStringDto,
    }),
    Authorized(['user']),
  );
