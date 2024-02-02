import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
