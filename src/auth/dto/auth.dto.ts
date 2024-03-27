import { User } from '@prisma/client';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: User['email'];

  @IsString()
  @IsNotEmpty()
  password: User['password'];
}
