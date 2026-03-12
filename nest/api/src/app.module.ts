import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TasksModule } from "./modules/tasks/tasks.module";

@Module({
  imports: [ConfigModule, AuthModule, TasksModule]
})
export class AppModule {}
