import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import { Header, UseFilters } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/ws.filter';

@UseFilters(AllExceptionsFilter)
@WebSocketGateway({ cors: '*:*' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  sendMessage(@MessageBody() message: MessageDto) {
    this.server.emit('message', message);
  }

  @SubscribeMessage('connection')
  connect(@MessageBody() message: MessageDto) {
    this.server.emit('connection', message);
  }
}
