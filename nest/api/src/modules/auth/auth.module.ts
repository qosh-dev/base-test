import { Module } from "@nestjs/common";
import {
  JwtAuthGuard,
  JwtService,
  RefreshGuard,
  RoleGuard
} from "../../libs/validation/auth";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtAuthGuard, RoleGuard, RefreshGuard],
  exports: [AuthService, JwtService, JwtAuthGuard, RoleGuard, RefreshGuard]
})
export class AuthModule {}
