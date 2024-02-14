import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  create(authDto: AuthDto) {
    return { id: 'd', username: authDto.username };
  }

  createToken(authDto: AuthDto) {
    return { result: `This action returns all auth` };
  }

  removeToken() {
    return `This action returns auth`;
  }

  refreshToken() {}
}
