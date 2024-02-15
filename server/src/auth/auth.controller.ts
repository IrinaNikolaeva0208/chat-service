import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  register(authDto: AuthDto) {
    return this.authService.create(authDto);
  }

  @UseGuards(LocalAuthGuard)
  @GrpcMethod('AuthService', 'LogIn')
  login(authDto: AuthDto) {
    return this.authService.createToken(authDto);
  }

  @GrpcMethod('AuthService', 'LogOut')
  logout() {
    return this.authService.removeToken();
  }

  @GrpcMethod('AuthService', 'Refresh')
  refreshToken() {
    return this.authService.refreshToken();
  }
}
