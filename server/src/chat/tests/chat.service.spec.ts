import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ChatService } from '../chat.service';
import { MessageRepository } from '../message.repository';

describe('ChatService', () => {
  let chatService: ChatService;
  let messageRepository: MessageRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ChatService, MessageRepository],
    }).compile();

    messageRepository = moduleRef.get<MessageRepository>(MessageRepository);
    chatService = moduleRef.get<ChatService>(ChatService);
  });

  describe('getMessages', () => {
    it('should return a promise of array of messages', async () => {
      const result = Promise.resolve([
        {
          id: '4cefe3cb-a2de-4db9-860d-9a1718653818',
          text: 'hi',
          username: 'vasya',
        },
        {
          id: '5cefe3cb-a2de-4db9-860d-9a1718653818',
          text: '^_^',
          username: 'petya',
        },
      ]);
      jest.spyOn(messageRepository, 'getAll').mockResolvedValue(result);

      expect(chatService.getMessages()).resolves.toEqual(await result);
    });
  });

  describe('addMessages', () => {
    it('should return a promise of new message', async () => {
      const message = { text: 'hi', username: 'vasya' };
      jest.spyOn(messageRepository, 'add').mockImplementation((message) => {
        const id = randomUUID();
        return Promise.resolve({ id, ...message });
      });

      const result = await chatService.addMessage(message);
      expect(result).toHaveProperty('id');
      expect(result.text).toBe(message.text);
      expect(result.username).toBe(message.username);
    });
  });
});
