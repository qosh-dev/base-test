import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export interface IRegisterUserDto {
  email: string;
  password: string;
}

export class RegisterUserDto implements IRegisterUserDto {
  @ApiProperty({ type: String, example: 'user@test.com', description: 'Unique user email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, example: '123456', description: 'Password with minimum 6 characters' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
