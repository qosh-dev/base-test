import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { AuthService } from '../services/auth.service';
import { PostLoginUserApi, PostRegisterUserApi } from './api.decorators';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostRegisterUserApi()
  async register(@Body() data: RegisterUserDto): Promise<RegisterResponseDto> {
    return this.authService.register(data);
  }

  @PostLoginUserApi()
  async login(@Body() data: LoginUserDto): Promise<AuthResponseDto> {
    return this.authService.login(data);
  }
}
