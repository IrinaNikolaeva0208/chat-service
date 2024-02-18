import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { Metadata } from '@grpc/grpc-js';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { getTokenFromRequest } from './guards/helpers/getTokenFromRequest';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    const metadata = new Metadata();
    metadata.set(
      'Set-Cookie',
      `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    );

    return metadata;
  }

  removeToken() {
    return { result: 'Successfully logged out' };
  }

  async refreshToken(authDto: AuthDto, clientMetadata: Metadata) {
    const payload = { username: authDto.username };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = clientMetadata.get('Authorization')[0].slice(7);

    const metadata = new Metadata();
    metadata.set(
      'Set-Cookie',
      `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    );

    return metadata;
  }
}
