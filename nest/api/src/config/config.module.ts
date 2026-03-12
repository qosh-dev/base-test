import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleBase } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './config.consts';

export let Envs: EnvironmentVariables;

@Global()
@Module({
  imports: [
    ConfigModuleBase.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
  ],
})
export class ConfigModule {}

function validate(configuration: Record<string, unknown>) {
  const logger = new Logger(ConfigModule.name);
  const finalConfig = plainToInstance(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  Envs = finalConfig;
  logger.debug('Environment variables validated successfully');
  return finalConfig;
}
