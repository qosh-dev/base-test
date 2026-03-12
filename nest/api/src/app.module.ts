import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { AppController } from "./app.controller";

@Module({
  imports: [ConfigModule, AuthModule, TasksModule],
  controllers: [AppController],
})
export class AppModule {}
