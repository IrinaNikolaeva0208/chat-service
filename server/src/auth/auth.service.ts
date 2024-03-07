import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { Metadata } from '@grpc/grpc-js';
import { AuthDto } from './dto/auth.dto';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

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

    if (authDto.password)
      authDto.password = await bcrypt.hash(
        authDto.password,
        +this.configService.get<number>('CRYPT_SALT'),
      );

    return await this.userRepository.create(authDto);
  }

  async createGoogleIfNotExists(authDto: AuthDto) {
    let existingUser = await this.userRepository.findByUsername(
      authDto.username,
    );

    if (!existingUser) await this.userRepository.create(authDto);
  }

  async validateUser(authDto: AuthDto) {
    const userWithSameUsername = await this.userRepository.findByUsername(
      authDto.username,
    );

    if (await this.isCredentialsWrong(userWithSameUsername, authDto))
      return null;
    return userWithSameUsername;
  }

  async getAuthMetadata(authDto: AuthDto) {
    const { accessToken, refreshToken } = await this.signTokens(authDto);

    const metadata = new Metadata();
    metadata.set(
      'Set-Cookie',
      `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    );

    return metadata;
  }

  async signTokens(authDto: AuthDto) {
    const payload = { username: authDto.username };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  removeToken() {
    return { result: 'Successfully logged out' };
  }

  async refreshToken(authDto: AuthDto, clientMetadata: Metadata) {
    const payload = { username: authDto.username };
    const accessToken = await this.jwtService.signAsync(payload);
    const cookie = clientMetadata.get('Cookie')[0];
    const key = 'refreshToken=';
    const refreshToken = cookie.slice(cookie.indexOf(key) + key.length);

    const metadata = new Metadata();
    metadata.set(
      'Set-Cookie',
      `accessToken=${accessToken}; refreshToken=${refreshToken}`,
    );

    return metadata;
  }

  async isCredentialsWrong(user: AuthDto, dto: AuthDto) {
    return (
      !user ||
      !user.password ||
      !(await bcrypt.compare(dto.password, user.password))
    );
  }
}
