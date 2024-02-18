import { ExecutionContext, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getTokenFromRequest } from './helpers/getTokenFromRequest';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const accessToken = getTokenFromRequest(context);
    if (!accessToken) {
      return false;
    }

    const user = await this.jwtService.verifyAsync(accessToken);
    if (user === undefined) {
      return false;
    }

    const request = context.switchToRpc().getContext();
    request.user = user;
    return true;
  }
}
