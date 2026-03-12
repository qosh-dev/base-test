import type { Pool, PoolClient } from 'pg';

type Queryable = Pick<Pool, 'query'> | Pick<PoolClient, 'query'>;

export interface IGetUserByEmailSqlParams {
  email: string;
}

export interface IGetUserByEmailSqlResult {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface ICheckUserEmailExistsSqlParams {
  email: string;
}

export interface ICheckUserEmailExistsSqlResult {
  exists: boolean;
}

export interface ICreateUserSqlParams {
  email: string;
  password_hash: string;
}

export interface ICreateUserSqlResult {
  id: string;
  email: string;
  created_at: Date;
}

export const getUserByEmailSql = {
  run: async (
    params: IGetUserByEmailSqlParams,
    db: Queryable,
  ): Promise<IGetUserByEmailSqlResult[]> => {
    const result = await db.query<IGetUserByEmailSqlResult>(
      `SELECT id, email, password_hash, created_at FROM users WHERE email = $1 LIMIT 1`,
      [params.email],
    );
    return result.rows;
  },
};

export const checkUserEmailExistsSql = {
  run: async (
    params: ICheckUserEmailExistsSqlParams,
    db: Queryable,
  ): Promise<ICheckUserEmailExistsSqlResult[]> => {
    const result = await db.query<ICheckUserEmailExistsSqlResult>(
      `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists`,
      [params.email],
    );
    return result.rows;
  },
};

export const createUserSql = {
  run: async (
    params: ICreateUserSqlParams,
    db: Queryable,
  ): Promise<ICreateUserSqlResult[]> => {
    const result = await db.query<ICreateUserSqlResult>(
      `INSERT INTO users (email, password_hash, created_at) VALUES ($1, $2, NOW()) RETURNING id, email, created_at`,
      [params.email, params.password_hash],
    );
    return result.rows;
  },
};
