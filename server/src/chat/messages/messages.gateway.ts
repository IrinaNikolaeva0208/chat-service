import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { UseFilters, UsePipes, OnModuleInit, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { MessageDto } from './dto';
import { ChatService } from './messages.service';
import { AllExceptionsFilter } from './filters/ws.filter';
import { WsPipe } from './pipes/ws.pipe';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@UseFilters(AllExceptionsFilter)
@UseGuards(JwtAuthGuard)
@UsePipes(WsPipe)
@WebSocketGateway({ cors: '*:*' })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('message')
  sendMessage(@MessageBody() message: MessageDto) {
    this.server.emit('message', message);
    this.chatService.addMessage(message);
  }

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log('client connected', socket.id);

      const messageList = await this.chatService.getMessages();
      socket.send(messageList);

      socket.on('disconnect', (reason) => {
        console.log(`disconnect ${socket.id} due to ${reason}`);
      });
    });
  }
}
