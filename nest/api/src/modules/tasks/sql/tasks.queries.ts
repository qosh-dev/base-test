import type { Pool, PoolClient } from 'pg';
import { TaskStatus } from '../../../libs/dto/get-paginated-base.dto';

type Queryable = Pick<Pool, 'query'> | Pick<PoolClient, 'query'>;

export interface ICreateTaskSqlParams {
  user_id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
}

export interface ITaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
}

export interface IGetTasksSqlParams {
  user_id: string;
  status?: TaskStatus | null;
  limit: number;
  offset: number;
}

export interface ICountTasksSqlParams {
  user_id: string;
  status?: TaskStatus | null;
}

export interface ICountTasksSqlResult {
  total: number;
}

export interface IGetTaskByIdSqlParams {
  id: string;
}

export interface IUpdateTaskSqlParams {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
}

export interface ISoftDeleteTaskSqlParams {
  id: string;
}

export const createTaskSql = {
  run: async (params: ICreateTaskSqlParams, db: Queryable): Promise<ITaskRow[]> => {
    const result = await db.query<ITaskRow>(
      `INSERT INTO tasks (user_id, title, description, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, user_id, title, description, status, created_at, updated_at`,
      [params.user_id, params.title, params.description ?? null, params.status],
    );
    return result.rows;
  },
};

export const getTasksSql = {
  run: async (params: IGetTasksSqlParams, db: Queryable): Promise<ITaskRow[]> => {
    const result = await db.query<ITaskRow>(
      `SELECT id, user_id, title, description, status, created_at, updated_at
       FROM tasks
       WHERE user_id = $1 AND deleted_at IS NULL AND ($2::task_status IS NULL OR status = $2)
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [params.user_id, params.status ?? null, params.limit, params.offset],
    );
    return result.rows;
  },
};

export const countTasksSql = {
  run: async (params: ICountTasksSqlParams, db: Queryable): Promise<ICountTasksSqlResult[]> => {
    const result = await db.query<ICountTasksSqlResult>(
      `SELECT COUNT(*)::int as total
       FROM tasks
       WHERE user_id = $1 AND deleted_at IS NULL AND ($2::task_status IS NULL OR status = $2)`,
      [params.user_id, params.status ?? null],
    );
    return result.rows;
  },
};

export const getTaskByIdSql = {
  run: async (params: IGetTaskByIdSqlParams, db: Queryable): Promise<ITaskRow[]> => {
    const result = await db.query<ITaskRow>(
      `SELECT id, user_id, title, description, status, created_at, updated_at FROM tasks WHERE id = $1 LIMIT 1`,
      [params.id],
    );
    return result.rows;
  },
};

export const updateTaskSql = {
  run: async (params: IUpdateTaskSqlParams, db: Queryable): Promise<ITaskRow[]> => {
    const result = await db.query<ITaskRow>(
      `UPDATE tasks
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           status = COALESCE($4, status),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, user_id, title, description, status, created_at, updated_at`,
      [params.id, params.title ?? null, params.description ?? null, params.status ?? null],
    );
    return result.rows;
  },
};

export const softDeleteTaskSql = {
  run: async (params: ISoftDeleteTaskSqlParams, db: Queryable): Promise<Array<{ id: string }>> => {
    const result = await db.query<{ id: string }>(
      `UPDATE tasks SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING id`,
      [params.id],
    );
    return result.rows;
  },
};
