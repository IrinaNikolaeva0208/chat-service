import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import { Header } from '@nestjs/common';

@WebSocketGateway({ cors: '*:*' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  sendMessage(@MessageBody() message: MessageDto) {
    console.log(message);
  }

  @Header('Access-Control-Allow-Origin', '*')
  @SubscribeMessage('connection')
  connect(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(message);
  }
}
