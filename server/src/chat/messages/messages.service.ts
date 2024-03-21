import { Injectable } from '@nestjs/common';
import { MessageRepository } from './messages.repository';
import { MessageDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async addMessage(message: MessageDto) {
    return await this.messageRepository.add(message);
  }

  async getMessages() {
    return await this.messageRepository.getAll();
  }
}
