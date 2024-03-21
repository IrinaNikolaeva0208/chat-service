import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './messages/filters/ws.filter';
import { WsPipe } from './messages/pipes/ws.pipe';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new WsPipe());
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('WS_PORT'));
}
bootstrap();
