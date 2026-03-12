/** Types generated for queries found in "src/modules/tasks/sql/tasks.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type task_status = 'done' | 'pending';

export type NumberOrString = number | string;

/** 'CreateTaskSql' parameters type */
export interface ICreateTaskSqlParams {
  description?: string | null | void;
  status: task_status;
  title: string;
  user_id: string;
}

/** 'CreateTaskSql' return type */
export interface ICreateTaskSqlResult {
  created_at: Date;
  description: string | null;
  id: string;
  status: task_status;
  title: string;
  updated_at: Date;
  user_id: string;
}

/** 'CreateTaskSql' query type */
export interface ICreateTaskSqlQuery {
  params: ICreateTaskSqlParams;
  result: ICreateTaskSqlResult;
}

const createTaskSqlIR: any = {"usedParamSet":{"user_id":true,"title":true,"description":true,"status":true},"params":[{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":113}]},{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":118,"b":124}]},{"name":"description","required":false,"transform":{"type":"scalar"},"locs":[{"a":129,"b":140}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":145,"b":152}]}],"statement":"INSERT INTO tasks (\n  user_id,\n  title,\n  description,\n  status,\n  created_at,\n  updated_at\n) VALUES (\n  :user_id!,\n  :title!,\n  :description,\n  :status!,\n  NOW(),\n  NOW()\n)\nRETURNING id, user_id, title, description, status, created_at, updated_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO tasks (
 *   user_id,
 *   title,
 *   description,
 *   status,
 *   created_at,
 *   updated_at
 * ) VALUES (
 *   :user_id!,
 *   :title!,
 *   :description,
 *   :status!,
 *   NOW(),
 *   NOW()
 * )
 * RETURNING id, user_id, title, description, status, created_at, updated_at
 * ```
 */
export const createTaskSql = new PreparedQuery<ICreateTaskSqlParams,ICreateTaskSqlResult>(createTaskSqlIR);


/** 'GetTasksSql' parameters type */
export interface IGetTasksSqlParams {
  limit: NumberOrString;
  offset: NumberOrString;
  status?: task_status | null | void;
  user_id: string;
}

/** 'GetTasksSql' return type */
export interface IGetTasksSqlResult {
  created_at: Date;
  description: string | null;
  id: string;
  status: task_status;
  title: string;
  updated_at: Date;
  user_id: string;
}

/** 'GetTasksSql' query type */
export interface IGetTasksSqlQuery {
  params: IGetTasksSqlParams;
  result: IGetTasksSqlResult;
}

const getTasksSqlIR: any = {"usedParamSet":{"user_id":true,"status":true,"limit":true,"offset":true},"params":[{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":112,"b":120}]},{"name":"status","required":false,"transform":{"type":"scalar"},"locs":[{"a":154,"b":160},{"a":195,"b":201}]},{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":235,"b":241}]},{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":250,"b":257}]}],"statement":"SELECT\n  id,\n  user_id,\n  title,\n  description,\n  status,\n  created_at,\n  updated_at\nFROM tasks\nWHERE user_id = :user_id!\n  AND deleted_at IS NULL\n  AND (:status::task_status IS NULL OR status = :status)\nORDER BY created_at DESC\nLIMIT :limit!\nOFFSET :offset!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   user_id,
 *   title,
 *   description,
 *   status,
 *   created_at,
 *   updated_at
 * FROM tasks
 * WHERE user_id = :user_id!
 *   AND deleted_at IS NULL
 *   AND (:status::task_status IS NULL OR status = :status)
 * ORDER BY created_at DESC
 * LIMIT :limit!
 * OFFSET :offset!
 * ```
 */
export const getTasksSql = new PreparedQuery<IGetTasksSqlParams,IGetTasksSqlResult>(getTasksSqlIR);


/** 'CountTasksSql' parameters type */
export interface ICountTasksSqlParams {
  status?: task_status | null | void;
  user_id: string;
}

/** 'CountTasksSql' return type */
export interface ICountTasksSqlResult {
  total: number | null;
}

/** 'CountTasksSql' query type */
export interface ICountTasksSqlQuery {
  params: ICountTasksSqlParams;
  result: ICountTasksSqlResult;
}

const countTasksSqlIR: any = {"usedParamSet":{"user_id":true,"status":true},"params":[{"name":"user_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":57,"b":65}]},{"name":"status","required":false,"transform":{"type":"scalar"},"locs":[{"a":99,"b":105},{"a":140,"b":146}]}],"statement":"SELECT COUNT(*)::int as total\nFROM tasks\nWHERE user_id = :user_id!\n  AND deleted_at IS NULL\n  AND (:status::task_status IS NULL OR status = :status)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)::int as total
 * FROM tasks
 * WHERE user_id = :user_id!
 *   AND deleted_at IS NULL
 *   AND (:status::task_status IS NULL OR status = :status)
 * ```
 */
export const countTasksSql = new PreparedQuery<ICountTasksSqlParams,ICountTasksSqlResult>(countTasksSqlIR);


/** 'GetTaskByIdSql' parameters type */
export interface IGetTaskByIdSqlParams {
  id: string;
}

/** 'GetTaskByIdSql' return type */
export interface IGetTaskByIdSqlResult {
  created_at: Date;
  description: string | null;
  id: string;
  status: task_status;
  title: string;
  updated_at: Date;
  user_id: string;
}

/** 'GetTaskByIdSql' query type */
export interface IGetTaskByIdSqlQuery {
  params: IGetTaskByIdSqlParams;
  result: IGetTaskByIdSqlResult;
}

const getTaskByIdSqlIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":107,"b":110}]}],"statement":"SELECT\n  id,\n  user_id,\n  title,\n  description,\n  status,\n  created_at,\n  updated_at\nFROM tasks\nWHERE id = :id!\n  AND deleted_at IS NULL\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   user_id,
 *   title,
 *   description,
 *   status,
 *   created_at,
 *   updated_at
 * FROM tasks
 * WHERE id = :id!
 *   AND deleted_at IS NULL
 * LIMIT 1
 * ```
 */
export const getTaskByIdSql = new PreparedQuery<IGetTaskByIdSqlParams,IGetTaskByIdSqlResult>(getTaskByIdSqlIR);


/** 'UpdateTaskSql' parameters type */
export interface IUpdateTaskSqlParams {
  description?: string | null | void;
  id: string;
  status?: task_status | null | void;
  title?: string | null | void;
}

/** 'UpdateTaskSql' return type */
export interface IUpdateTaskSqlResult {
  created_at: Date;
  description: string | null;
  id: string;
  status: task_status;
  title: string;
  updated_at: Date;
  user_id: string;
}

/** 'UpdateTaskSql' query type */
export interface IUpdateTaskSqlQuery {
  params: IUpdateTaskSqlParams;
  result: IUpdateTaskSqlResult;
}

const updateTaskSqlIR: any = {"usedParamSet":{"title":true,"description":true,"status":true,"id":true},"params":[{"name":"title","required":false,"transform":{"type":"scalar"},"locs":[{"a":36,"b":41}]},{"name":"description","required":false,"transform":{"type":"scalar"},"locs":[{"a":77,"b":88}]},{"name":"status","required":false,"transform":{"type":"scalar"},"locs":[{"a":125,"b":131}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":175,"b":178}]}],"statement":"UPDATE tasks\nSET\n  title = COALESCE(:title, title),\n  description = COALESCE(:description, description),\n  status = COALESCE(:status, status),\n  updated_at = NOW()\nWHERE id = :id!\nRETURNING id, user_id, title, description, status, created_at, updated_at"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE tasks
 * SET
 *   title = COALESCE(:title, title),
 *   description = COALESCE(:description, description),
 *   status = COALESCE(:status, status),
 *   updated_at = NOW()
 * WHERE id = :id!
 * RETURNING id, user_id, title, description, status, created_at, updated_at
 * ```
 */
export const updateTaskSql = new PreparedQuery<IUpdateTaskSqlParams,IUpdateTaskSqlResult>(updateTaskSqlIR);


/** 'SoftDeleteTaskSql' parameters type */
export interface ISoftDeleteTaskSqlParams {
  id: string;
}

/** 'SoftDeleteTaskSql' return type */
export interface ISoftDeleteTaskSqlResult {
  id: string;
}

/** 'SoftDeleteTaskSql' query type */
export interface ISoftDeleteTaskSqlQuery {
  params: ISoftDeleteTaskSqlParams;
  result: ISoftDeleteTaskSqlResult;
}

const softDeleteTaskSqlIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":74}]}],"statement":"UPDATE tasks\nSET\n  deleted_at = NOW(),\n  updated_at = NOW()\nWHERE id = :id!\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE tasks
 * SET
 *   deleted_at = NOW(),
 *   updated_at = NOW()
 * WHERE id = :id!
 * RETURNING id
 * ```
 */
export const softDeleteTaskSql = new PreparedQuery<ISoftDeleteTaskSqlParams,ISoftDeleteTaskSqlResult>(softDeleteTaskSqlIR);


/** 'DeleteTaskSql' parameters type */
export interface IDeleteTaskSqlParams {
  id: string;
}

/** 'DeleteTaskSql' return type */
export interface IDeleteTaskSqlResult {
  id: string;
}

/** 'DeleteTaskSql' query type */
export interface IDeleteTaskSqlQuery {
  params: IDeleteTaskSqlParams;
  result: IDeleteTaskSqlResult;
}

const deleteTaskSqlIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":29,"b":32}]}],"statement":"DELETE FROM tasks\nWHERE id = :id!\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM tasks
 * WHERE id = :id!
 * RETURNING id
 * ```
 */
export const deleteTaskSql = new PreparedQuery<IDeleteTaskSqlParams,IDeleteTaskSqlResult>(deleteTaskSqlIR);


