import { Module } from '@nestjs/common';
import { ChatModule } from './messages/messages.module';

@Module({
  imports: [ChatModule],
})
export class AppModule {}
