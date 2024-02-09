import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './filters/ws.filter';
import { WsPipe } from './pipes/ws.pipe';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new WsPipe());
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('WS_PORT'));
}
bootstrap();
