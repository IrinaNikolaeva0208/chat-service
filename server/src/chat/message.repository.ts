import { PrismaClient } from '@prisma/client';
import { MessageDto } from './dto';
import { Injectable } from '@nestjs/common';

const prisma = new PrismaClient();

@Injectable()
export class MessageRepository {
  async getAll() {
    return await prisma.message.findMany();
  }

  async add(message: MessageDto) {
    return await prisma.message.create({ data: message });
  }
}
