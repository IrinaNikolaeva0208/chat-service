import { PrismaClient } from '@prisma/client';
import { AuthDto } from './dto/auth.dto';
import { Injectable } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export class UserRepository {
  async create(user: AuthDto) {
    return await prisma.user.create({ data: user });
  }

  async findByUsername(username: string) {
    return (await prisma.user.findUnique({ where: { username } })) as AuthDto;
  }
}
