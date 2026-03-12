import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum NodeEnv {
  test = 'test',
  development = 'development',
  production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsNotEmpty()
  @IsString()
  HOST: string = '0.0.0.0';

  @Transform(({ value }) => Number(value))
  @IsNumber()
  PORT: number = 3001;

  @IsNotEmpty()
  @IsString()
  APP_PREFIX: string = 'api';

  @IsNotEmpty()
  @IsString()
  OPEN_API_TITLE: string = 'Task Manager Nest API';

  @IsNotEmpty()
  @IsString()
  OPEN_API_VERSION: string = '1.0.0';

  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_USER: string;

  @IsNotEmpty()
  @IsString()
  DB_PASS: string;

  @IsNotEmpty()
  @IsString()
  DB_NAME: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRES_IN: string = '7d';

  @Transform(({ value }) => Number(value))
  @IsNumber()
  PASS_SALT: number = 10;

  get DATABASE_URL(): string {
    return `postgres://${encodeURIComponent(this.DB_USER)}:${encodeURIComponent(this.DB_PASS)}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`;
  }
}
