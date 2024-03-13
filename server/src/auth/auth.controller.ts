import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  register(authDto: AuthDto) {
    return this.authService.create(authDto);
  }

  @UseGuards(LocalAuthGuard)
  @GrpcMethod('AuthService', 'LogIn')
  async login(
    authDto: AuthDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const serverMetadata = await this.authService.getAuthMetadata(authDto);

    call.sendMetadata(serverMetadata);
    return { result: 'Successfully logged in' };
  }

  @UseGuards(JwtAuthGuard)
  @GrpcMethod('AuthService', 'LogOut')
  logout() {
    return this.authService.removeToken();
  }

  @UseGuards(JwtRefreshGuard)
  @GrpcMethod('AuthService', 'Refresh')
  async refreshToken(
    _: any,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const serverMetadata = await this.authService.refreshToken(
      metadata['user'],
      metadata,
    );

    call.sendMetadata(serverMetadata);
    return { result: 'Successfully refreshed' };
  }
}
