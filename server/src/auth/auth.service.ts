import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  create(authDto: AuthDto) {
    return { id: 'd', username: authDto.username };
  }

  createToken(authDto: AuthDto) {
    return { result: authDto.toString() };
  }

  removeToken() {
    return `This action returns auth`;
  }

  refreshToken() {}
}
