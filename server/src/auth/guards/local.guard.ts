import { ExecutionContext, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const requestData = context.switchToRpc().getData();

    const user = await this.authService.validateUser(requestData);
    return user ? true : false;
  }
}
