import { Injectable, Logger } from '@nestjs/common';
import { db } from '../../../core/postgres';
import { FindManyResponseBase, IGetPaginatedBaseDto, TaskStatus } from '../../../libs/dto';
import {
  ApiError,
  ForbiddenErrorCode,
  NotFoundErrorCode,
} from '../../../libs/validation/error-codes';
import { ICreateTaskDto } from '../dto/create-task.dto';
import { TaskResponseDto } from '../dto/task-response.dto';
import { IUpdateTaskDto } from '../dto/update-task.dto';
import {
  countTasksSql,
  createTaskSql, getTaskByIdSql,
  getTasksSql,
  softDeleteTaskSql,
  updateTaskSql,
  type IGetTaskByIdSqlResult
} from '../sql/tasks.queries';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  async create(userId: string, data: ICreateTaskDto): Promise<TaskResponseDto> {
    const [task] = await createTaskSql.run(
      {
        user_id: userId,
        title: data.title,
        description: data.description ?? null,
        status: data.status,
      },
      db,
    );

    return this.mapTask(task);
  }

  async findMany(
    userId: string,
    query: IGetPaginatedBaseDto,
  ): Promise<FindManyResponseBase<TaskResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const [items, [countRow]] = await Promise.all([
      getTasksSql.run(
        {
          user_id: userId,
          status: query.status ?? null,
          limit,
          offset,
        },
        db,
      ),
      countTasksSql.run(
        {
          user_id: userId,
          status: query.status ?? null,
        },
        db,
      ),
    ]);

    return FindManyResponseBase.serialize({
      page,
      limit,
      total: countRow?.total ?? 0,
      items: items.map((task) => this.mapTask(task)),
    });
  }

  async findById(userId: string, id: string): Promise<TaskResponseDto> {
    const [task] = await getTaskByIdSql.run({ id }, db);
    if (!task || !task.id) {
      throw new ApiError(NotFoundErrorCode.RESOURCE_NOT_FOUND);
    }

    this.assertOwnership(userId, task);
    return this.mapTask(task);
  }

  async update(userId: string, id: string, data: IUpdateTaskDto): Promise<TaskResponseDto> {
    await this.findById(userId, id);

    const [task] = await updateTaskSql.run(
      {
        id,
        title: data.title ?? null,
        description: data.description ?? null,
        status: data.status ?? null,
      },
      db,
    );

    return this.mapTask(task);
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.findById(userId, id);
    await softDeleteTaskSql.run({ id }, db);
    this.logger.log(`Task soft deleted: ${id}`);
  }

  private assertOwnership(userId: string, task: IGetTaskByIdSqlResult): void {
    if (task.user_id !== userId) {
      throw new ApiError(ForbiddenErrorCode.INSUFFICIENT_PERMISSIONS);
    }
  }

  private mapTask(task: IGetTaskByIdSqlResult): TaskResponseDto {
    return {
      id: task.id,
      user_id: task.user_id,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      created_at: task.created_at.toISOString(),
      updated_at: task.updated_at.toISOString(),
    };
  }
}
