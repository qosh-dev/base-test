import { Injectable, Logger } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { db } from '../../../core/postgres';
import { Envs } from '../../../config/config.module';
import { JwtService } from '../../../libs/validation/auth';
import {
    ApiError,
    ConflictErrorCode,
    UnauthorizedErrorCode,
} from '../../../libs/validation/error-codes';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ILoginUserDto } from '../dto/login-user.dto';
import { IRegisterUserDto } from '../dto/register-user.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { checkUserEmailExistsSql, createUserSql, getUserByEmailSql } from '../sql/auth.queries';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  async register(data: IRegisterUserDto): Promise<RegisterResponseDto> {
    const [exists] = await checkUserEmailExistsSql.run({ email: data.email }, db);
    if (exists?.exists) {
      throw new ApiError(ConflictErrorCode.EMAIL_EXISTS);
    }

    const passwordHash = await bcrypt.hash(data.password, Envs.PASS_SALT);
    const [user] = await createUserSql.run(
      {
        email: data.email,
        password_hash: passwordHash,
      },
      db,
    );

    this.logger.log(`User registered: ${user.email}`);

    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at.toISOString(),
    };
  }

  async login(data: ILoginUserDto): Promise<AuthResponseDto> {
    const [user] = await getUserByEmailSql.run({ email: data.email }, db);
    if (!user) {
      throw new ApiError(UnauthorizedErrorCode.INVALID_CREDENTIALS);
    }

    const valid = await bcrypt.compare(data.password, user.password_hash);
    if (!valid) {
      throw new ApiError(UnauthorizedErrorCode.INVALID_CREDENTIALS);
    }

    const token = this.jwtService.signToken({
      userId: user.id,
      email: user.email,
    });

    return { token };
  }
}
