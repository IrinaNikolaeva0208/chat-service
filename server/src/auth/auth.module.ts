import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
