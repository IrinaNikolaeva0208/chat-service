import { ExecutionContext, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getTokenFromRequest } from './helpers/getTokenFromRequest';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configservice: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const refreshToken = getTokenFromRequest(context, 'refreshToken=');
    if (!refreshToken) {
      return false;
    }

    const user = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configservice.get<string>('JWT_REFRESH_KEY'),
    });
    if (user === undefined) {
      return false;
    }

    const request = context.switchToRpc().getContext();
    request.user = user;
    return true;
  }
}
