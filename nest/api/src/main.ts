import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
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

  await app.register(fastifyCors as any, {
    origin: true,
  });

  initializePg();
  await app.getHttpAdapter().getInstance().ready();

  AppConfigProvider.provide(app);
  ExceptionFilter.provide(app);
  OpenApiProvider.provide(app);

  app.getHttpAdapter().getInstance().get('/health', async (_request, reply) => {
    const result = await initializePg().query('SELECT 1');
    reply.send({ status: 'ok', db: result.rowCount === 1 ? 'connected' : 'unknown' });
  });

  await app.listen({
    port: Envs.PORT,
    host: Envs.HOST,
  });

  new Logger('Application').log(`Task Manager Nest API started on http://${Envs.HOST}:${Envs.PORT}`);
}

bootstrap();
