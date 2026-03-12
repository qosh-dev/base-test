import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export interface ILoginUserDto {
  email: string;
  password: string;
}

export class LoginUserDto implements ILoginUserDto {
  @ApiProperty({ type: String, example: 'user@test.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, example: '123456', description: 'User password' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
