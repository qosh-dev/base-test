/** Types generated for queries found in "src/modules/auth/sql/auth.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetUserByEmailSql' parameters type */
export interface IGetUserByEmailSqlParams {
  email: string;
}

/** 'GetUserByEmailSql' return type */
export interface IGetUserByEmailSqlResult {
  created_at: Date;
  email: string;
  id: string;
  password_hash: string;
}

/** 'GetUserByEmailSql' query type */
export interface IGetUserByEmailSqlQuery {
  params: IGetUserByEmailSqlParams;
  result: IGetUserByEmailSqlResult;
}

const getUserByEmailSqlIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":77,"b":83}]}],"statement":"SELECT\n  id,\n  email,\n  password_hash,\n  created_at\nFROM users\nWHERE email = :email!\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   email,
 *   password_hash,
 *   created_at
 * FROM users
 * WHERE email = :email!
 * LIMIT 1
 * ```
 */
export const getUserByEmailSql = new PreparedQuery<IGetUserByEmailSqlParams,IGetUserByEmailSqlResult>(getUserByEmailSqlIR);


/** 'CheckUserEmailExistsSql' parameters type */
export interface ICheckUserEmailExistsSqlParams {
  email: string;
}

/** 'CheckUserEmailExistsSql' return type */
export interface ICheckUserEmailExistsSqlResult {
  exists: boolean | null;
}

/** 'CheckUserEmailExistsSql' query type */
export interface ICheckUserEmailExistsSqlQuery {
  params: ICheckUserEmailExistsSqlParams;
  result: ICheckUserEmailExistsSqlResult;
}

const checkUserEmailExistsSqlIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":57}]}],"statement":"SELECT EXISTS(\n  SELECT 1 FROM users WHERE email = :email!\n) as exists"};

/**
 * Query generated from SQL:
 * ```
 * SELECT EXISTS(
 *   SELECT 1 FROM users WHERE email = :email!
 * ) as exists
 * ```
 */
export const checkUserEmailExistsSql = new PreparedQuery<ICheckUserEmailExistsSqlParams,ICheckUserEmailExistsSqlResult>(checkUserEmailExistsSqlIR);


/** 'CreateUserSql' parameters type */
export interface ICreateUserSqlParams {
  email: string;
  password_hash: string;
}

/** 'CreateUserSql' return type */
export interface ICreateUserSqlResult {
  created_at: Date;
  email: string;
  id: string;
}

/** 'CreateUserSql' query type */
export interface ICreateUserSqlQuery {
  params: ICreateUserSqlParams;
  result: ICreateUserSqlResult;
}

const createUserSqlIR: any = {"usedParamSet":{"email":true,"password_hash":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":78}]},{"name":"password_hash","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":97}]}],"statement":"INSERT INTO users (\n  email,\n  password_hash,\n  created_at\n) VALUES (\n  :email!,\n  :password_hash!,\n  NOW()\n)\nRETURNING id, email, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (
 *   email,
 *   password_hash,
 *   created_at
 * ) VALUES (
 *   :email!,
 *   :password_hash!,
 *   NOW()
 * )
 * RETURNING id, email, created_at
 * ```
 */
export const createUserSql = new PreparedQuery<ICreateUserSqlParams,ICreateUserSqlResult>(createUserSqlIR);


