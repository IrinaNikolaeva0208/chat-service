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

    const request = context.switchToRpc().getContext();
    request.user = user;
    return true;
  }

  getTokenFromRequest(context: ExecutionContext) {
    const type = context.getType();
    const prefix = 'Bearer ';
    let header = '';
    if (type === 'rpc') {
      const metadata = context.getArgByIndex(1);
      if (!metadata) {
        return null;
      }
      header = metadata.get('Authorization')[0];
    }

    if (!header || !header.includes(prefix)) {
      return null;
    }
    return header.slice(header.indexOf(' ') + 1);
  }
}
