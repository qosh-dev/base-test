/* @name getUserByEmailSql */
SELECT
  id,
  email,
  password_hash,
  created_at
FROM users
WHERE email = :email!
LIMIT 1;

/* @name checkUserEmailExistsSql */
SELECT EXISTS(
  SELECT 1 FROM users WHERE email = :email!
) as exists;

/* @name createUserSql */
INSERT INTO users (
  email,
  password_hash,
  created_at
) VALUES (
  :email!,
  :password_hash!,
  NOW()
)
RETURNING id, email, created_at;
