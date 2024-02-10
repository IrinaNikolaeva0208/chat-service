import { Test } from '@nestjs/testing';
import { ChatService } from '../chat.service';
import { MessageRepository } from '../message.repository';
import { db, messageRepo, correctMessage } from './utils';

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
      const result = Promise.resolve(db);
      jest.spyOn(messageRepository, 'getAll').mockResolvedValue(result);

      expect(chatService.getMessages()).resolves.toEqual(await result);
    });
  });

  describe('addMessages', () => {
    it('should return a promise of new message', async () => {
      jest.spyOn(messageRepository, 'add').mockImplementation(messageRepo.add);

      const result = await chatService.addMessage(correctMessage);
      expect(result).toHaveProperty('id');
      expect(result.text).toBe(correctMessage.text);
      expect(result.username).toBe(correctMessage.username);
    });
  });
});
