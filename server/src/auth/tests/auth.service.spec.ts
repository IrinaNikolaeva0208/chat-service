import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UserRepository } from '../user.repository';
import {
  db,
  userRepo,
  validLocalUser,
  existingUser,
  validGoogleUser,
} from './utils';
import { ConfigService } from '@nestjs/config';

describe('ChatService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, UserRepository, JwtService, ConfigService],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('create', () => {
    it('should return freshly created user', async () => {
      jest.spyOn(userRepository, 'create').mockImplementation(userRepo.create);
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockImplementation(userRepo.findByUsername);

      const result = await authService.create(validLocalUser);
      expect(result.username).toBe(validLocalUser.username);
      expect(result.provider).toBeUndefined();
    });
  });

  describe('removeToken', () => {
    it('should respond with SUCCESSFUL message', () => {
      const response = authService.removeToken();
      expect(response.result).toBe('Successfully logged out');
    });
  });

  describe('createGoogleIfNotExists', () => {
    it('should create user', async () => {
      jest.spyOn(userRepository, 'create').mockImplementation(userRepo.create);
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockImplementation(userRepo.findByUsername);

      const dbSize = db.length;
      await authService.createGoogleIfNotExists(validGoogleUser);

      expect(db.find((item) => item.username == validGoogleUser.username)).toBe(
        validGoogleUser,
      );
      expect(db.length).toBe(dbSize + 1);
    });

    it('should not create user', async () => {
      jest.spyOn(userRepository, 'create').mockImplementation(userRepo.create);
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockImplementation(userRepo.findByUsername);

      const dbSize = db.length;
      await authService.createGoogleIfNotExists(existingUser);
      expect(db.length).toBe(dbSize);
    });
  });

  describe('validateUser', () => {
    it('should respond with user data if user exists', async () => {
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockImplementation(userRepo.findByUsername);
      const result = await authService.validateUser({
        username: 'petya',
        password: 'gbhjm',
      });

      expect(result).toHaveProperty('username');
    });

    it('should respond with null is user does not exist', async () => {
      jest
        .spyOn(userRepository, 'findByUsername')
        .mockImplementation(userRepo.findByUsername);
      const result = await authService.validateUser(validLocalUser);

      expect(result).toBeNull();
    });
  });
});
