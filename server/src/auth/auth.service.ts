import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { Metadata } from '@grpc/grpc-js';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

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

  async createAuthMetadata(authDto: AuthDto) {
    const payload = { username: authDto.username };
    const accessToken = await this.jwtService.signAsync(payload);

    const metadata = new Metadata();
    metadata.set('Set-Cookie', `accessToken=${accessToken};`);

    return metadata;
  }

  removeToken() {
    return { result: 'Successfully logged out' };
  }

  refreshToken() {}
}
