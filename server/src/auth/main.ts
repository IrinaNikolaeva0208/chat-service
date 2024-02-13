import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(__dirname, 'proto/app.proto'),
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('AUTH_PORT');

  app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
