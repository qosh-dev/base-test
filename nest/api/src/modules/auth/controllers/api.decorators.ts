import { HttpStatus, Post, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponses } from '../../../libs/open-api';
import { ConflictErrorCode, UnauthorizedErrorCode, BadRequestErrorCode } from '../../../libs/validation/error-codes';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { RegisterUserDto } from '../dto/register-user.dto';

export const PostRegisterUserApi = () =>
  applyDecorators(
    Post('register'),
    ApiOperation({
      summary: 'Register user',
      description: 'Create a new user account with unique email and hashed password.',
    }),
    ApiResponses({
      [HttpStatus.CREATED]: {
        model: RegisterResponseDto,
        description: 'User created successfully',
      },
      [HttpStatus.BAD_REQUEST]: [BadRequestErrorCode.INVALID_REQUEST],
      [HttpStatus.CONFLICT]: [ConflictErrorCode.EMAIL_EXISTS],
      autoValidationErrors: RegisterUserDto,
    }),
  );

export const PostLoginUserApi = () =>
  applyDecorators(
    Post('login'),
    ApiOperation({
      summary: 'Login user',
      description: 'Authenticate user and return JWT token.',
    }),
    ApiResponses({
      [HttpStatus.OK]: {
        model: AuthResponseDto,
        description: 'User authenticated successfully',
      },
      [HttpStatus.BAD_REQUEST]: [BadRequestErrorCode.INVALID_REQUEST],
      [HttpStatus.UNAUTHORIZED]: [UnauthorizedErrorCode.INVALID_CREDENTIALS],
      autoValidationErrors: LoginUserDto,
    }),
  );
