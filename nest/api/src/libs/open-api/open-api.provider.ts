import { Logger } from '@nestjs/common';
import { FastifyInstance } from 'fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Envs } from '../../config/config.module';

export class OpenApiProvider {
  static provide(app: any) {
    const config = new DocumentBuilder()
      .setTitle(Envs.OPEN_API_TITLE)
      .setVersion(Envs.OPEN_API_VERSION)
      .setDescription('Task Manager API built with NestJS, Fastify, PostgreSQL and pgtyped.')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('explorer', app, document);

    const instance = app.getHttpAdapter().getInstance() as FastifyInstance;
    instance.get('/api-json', async (_request, reply) => reply.send(document));

    new Logger(OpenApiProvider.name).log(
      `OpenAPI initialized at http://${Envs.HOST}:${Envs.PORT}/explorer`,
    );
  }
}
