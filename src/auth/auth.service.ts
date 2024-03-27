import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: AuthDto) {
    const { email, password } = dto;
    const hash = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: { email, password: hash },
      });

      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already used');
        }
      }
      throw error;
    }
  }

  async signIn(dto: AuthDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException('Email not found');

    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches) throw new UnauthorizedException('Wrong password');

    delete user.password;
    return user;
  }
}
