import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot(), ChatModule],
})
export class AppModule {}
