import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageRepository } from './message.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ChatGateway, ChatService, MessageRepository],
})
export class ChatModule {}
