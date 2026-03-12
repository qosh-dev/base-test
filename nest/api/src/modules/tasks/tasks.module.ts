import { Module } from "@nestjs/common";
import { JwtService, JwtAuthGuard } from "../../libs/validation/auth";
import { TasksController } from "./controllers/tasks.controller";
import { TasksService } from "./services/tasks.service";

@Module({
  controllers: [TasksController],
  providers: [TasksService, JwtService, JwtAuthGuard],
  exports: [TasksService]
})
export class TasksModule {}
