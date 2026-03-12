import { Body, Controller, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, UserTokenPayload } from '../../../libs/validation/auth';
import { FindManyResponseBase, GetPaginatedBaseDto, IdStringDto } from '../../../libs/dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskResponseDto } from '../dto/task-response.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TasksService } from '../services/tasks.service';
import {
  DeleteTaskApi,
  GetAllTasksApi,
  GetByIdTaskApi,
  PostCreateTaskApi,
  PutUpdateTaskApi,
} from './api.decorators';

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @PostCreateTaskApi()
  async create(
    @CurrentUser() user: UserTokenPayload,
    @Body() data: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(user.userId, data);
  }

  @GetAllTasksApi()
  async findMany(
    @CurrentUser() user: UserTokenPayload,
    @Query() query: GetPaginatedBaseDto,
  ): Promise<FindManyResponseBase<TaskResponseDto>> {
    return this.tasksService.findMany(user.userId, query);
  }

  @GetByIdTaskApi()
  async findById(
    @CurrentUser() user: UserTokenPayload,
    @Param() params: IdStringDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findById(user.userId, params.id);
  }

  @PutUpdateTaskApi()
  async update(
    @CurrentUser() user: UserTokenPayload,
    @Param() params: IdStringDto,
    @Body() data: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(user.userId, params.id, data);
  }

  @DeleteTaskApi()
  async remove(
    @CurrentUser() user: UserTokenPayload,
    @Param() params: IdStringDto,
  ): Promise<{ success: boolean }> {
    await this.tasksService.delete(user.userId, params.id);
    return { success: true };
  }
}
