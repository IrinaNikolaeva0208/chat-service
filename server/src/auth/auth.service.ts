import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(authDto: AuthDto) {
    const userWithSameUsername = await this.userRepository.findByUsername(
      authDto.username,
    );

    if (userWithSameUsername) throw new RpcException('Username already in use');

    return await this.userRepository.create(authDto);
  }

  async validateUser(authDto: AuthDto) {
    const userWithSameUsername = await this.userRepository.findByUsername(
      authDto.username,
    );

    if (
      !userWithSameUsername ||
      authDto.password != userWithSameUsername.password
    )
      return null;
    return userWithSameUsername;
  }

  createToken(authDto: AuthDto) {
    return { result: authDto.toString() };
  }

  removeToken() {
    return `This action returns auth`;
  }

  refreshToken() {}
}
