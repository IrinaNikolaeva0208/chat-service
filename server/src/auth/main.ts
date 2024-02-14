import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.GRPC,
    options: {
      url: `auth:${process.env.AUTH_PORT}`,
      package: 'auth',
      protoPath: join(__dirname, 'auth/proto/app.proto'),
    },
  });

  await app.listen();
}

bootstrap();
