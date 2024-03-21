import { Test } from '@nestjs/testing';
import { ChatService } from '../messages/messages.service';
import { MessageRepository } from '../messages/messages.repository';
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

      const result = await chatService.addMessage({
        text: correctMessage.text,
        username: 'Excepteur',
      });
      expect(result).toHaveProperty('id');
      expect(result.text).toBe(correctMessage.text);
      expect(result.username).toBe('Excepteur');
    });
  });
});
