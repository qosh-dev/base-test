import { NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import { Envs } from '../../config/config.module';

export class AppConfigProvider {
  static async provide(app: NestFastifyApplication) {
    await app.register(fastifyCors as any, {
      origin: true,
    });

    app.setGlobalPrefix(Envs.APP_PREFIX);
  }
}
