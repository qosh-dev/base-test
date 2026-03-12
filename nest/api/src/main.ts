import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Envs } from './config/config.module';
import { initializePg } from './core/postgres';
import { AppConfigProvider } from './libs/app-config/app-config.provider';
import { OpenApiProvider } from './libs/open-api/open-api.provider';
import { ExceptionFilter } from './libs/validation/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await AppConfigProvider.provide(app);
  initializePg();

  ExceptionFilter.provide(app);
  OpenApiProvider.provide(app);


  await app.listen({
    port: Envs.PORT,
  });

  new Logger('Application').log(`Task Manager Nest API started on http://${Envs.HOST}:${Envs.PORT}`);
}

bootstrap();
