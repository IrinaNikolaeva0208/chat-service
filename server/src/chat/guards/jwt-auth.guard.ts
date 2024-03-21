import { ExecutionContext, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const accessToken = this.getTokenFromRequest(context);
    if (!accessToken) {
      return false;
    }

    const user = await this.jwtService.verifyAsync(accessToken);
    if (user === undefined) {
      return false;
    }

    const request = context.switchToWs().getData();
    request.username = user.username;
    return true;
  }

  getTokenFromRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    return client.handshake.headers.cookie
      .split('; ')
      .find((cookie: string) => cookie.startsWith('accessToken'))
      .split('=')[1];
  }
}
