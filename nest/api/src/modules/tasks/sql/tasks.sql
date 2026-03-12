/* @name createTaskSql */
INSERT INTO tasks (
  user_id,
  title,
  description,
  status,
  created_at,
  updated_at
) VALUES (
  :user_id!,
  :title!,
  :description,
  :status!,
  NOW(),
  NOW()
)
RETURNING id, user_id, title, description, status, created_at, updated_at;

/* @name getTasksSql */
SELECT
  id,
  user_id,
  title,
  description,
  status,
  created_at,
  updated_at
FROM tasks
WHERE user_id = :user_id!
  AND deleted_at IS NULL
  AND (:status::task_status IS NULL OR status = :status)
ORDER BY created_at DESC
LIMIT :limit!
OFFSET :offset!;

/* @name countTasksSql */
SELECT COUNT(*)::int as total
FROM tasks
WHERE user_id = :user_id!
  AND deleted_at IS NULL
  AND (:status::task_status IS NULL OR status = :status);

/* @name getTaskByIdSql */
SELECT
  id,
  user_id,
  title,
  description,
  status,
  created_at,
  updated_at
FROM tasks
WHERE id = :id!
  AND deleted_at IS NULL
LIMIT 1;

/* @name updateTaskSql */
UPDATE tasks
SET
  title = COALESCE(:title, title),
  description = COALESCE(:description, description),
  status = COALESCE(:status, status),
  updated_at = NOW()
WHERE id = :id!
RETURNING id, user_id, title, description, status, created_at, updated_at;

/* @name softDeleteTaskSql */
UPDATE tasks
SET
  deleted_at = NOW(),
  updated_at = NOW()
WHERE id = :id!
RETURNING id;


/* @name deleteTaskSql */
DELETE FROM tasks
WHERE id = :id!
RETURNING id;