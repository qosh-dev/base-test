import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Envs } from '../../config/config.module';

export class AppConfigProvider {
  static provide(app: NestFastifyApplication) {
    app.setGlobalPrefix(Envs.APP_PREFIX);
  }
}
