import { PrismaClient } from '@prisma/client';
import { AuthDto } from './dto/auth.dto';
import { Injectable } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export class MessageRepository {
  async create(user: AuthDto) {
    return await prisma.user.create({ data: user });
  }
}
