import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';
import { ExceptionFilter } from './filters/rpc.filter';

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
  app.useGlobalFilters(new ExceptionFilter());

  await app.listen();
}

bootstrap();
