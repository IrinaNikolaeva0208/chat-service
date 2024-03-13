import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthModule } from './auth.module';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { ExceptionFilter } from './filters/rpc.filter';
import { OAuthModule } from './oauth/oauth.module';
import { ConfigService } from '@nestjs/config';

dotenv.config();

async function bootstrap() {
  const grpcApp = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.GRPC,
    options: {
      url: `auth:${process.env.AUTH_PORT}`,
      package: 'auth',
      protoPath: join(__dirname, 'auth/proto/app.proto'),
    },
  });
  grpcApp.useGlobalFilters(new ExceptionFilter());

  await grpcApp.listen();

  const oauthApp = await NestFactory.create(OAuthModule);
  oauthApp.use(cookieParser());
  const configService = oauthApp.get(ConfigService);
  await oauthApp.listen(configService.get<number>('OAUTH_PORT'));
}

bootstrap();
