import { Socket, io } from 'socket.io-client';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ChatModule } from '../chat.module';
import { MessageRepository } from '../message.repository';
import { INestApplication } from '@nestjs/common';

describe('Chat', () => {
  let app: INestApplication;
  let ioClient1: Socket;
  let ioClient2: Socket;
  let db = [];
  let messageRepo = {
    getAll: async () => Promise.resolve(db),
    add: async (message) => {
      const newMessage = { id: randomUUID(), ...message };
      db.push(newMessage);
      return Promise.resolve(newMessage);
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ChatModule],
    })
      .overrideProvider(MessageRepository)
      .useValue(messageRepo)
      .compile();

    app = moduleRef.createNestApplication();

    ioClient1 = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    ioClient2 = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should respond with all previous messages to certain client in case of this client connection', async () => {
    ioClient1.connect();
    ioClient2.connect();

    const obj = { someFn: (data: any) => data };
    ioClient2.on('message', obj.someFn);

    await new Promise<void>((resolve) => {
      ioClient1.on('message', (data) => {
        expect(data).toEqual(db);
        const spyFn = jest.spyOn(obj, 'someFn');
        expect(spyFn).not.toHaveBeenCalled();

        resolve();
      });
    });

    ioClient1.disconnect();
    ioClient2.disconnect();
  });

  it('should emit proper message in case any client send something', async () => {
    ioClient1.connect();
    ioClient2.connect();

    const clientMessage = { username: 'vasya', text: "what's up?" };
    const testingFn = (data) => {
      expect(data.username).toBe(clientMessage.username);
      expect(data.text).toBe(clientMessage.text);
      expect(typeof data.id).toBe('string');
    };

    await new Promise<void>((resolve) => {
      ioClient1.on('message', (data) => {
        if (!Array.isArray(data)) testingFn(data);
        resolve();
      });
    });

    await new Promise<void>((resolve) => {
      ioClient2.on('message', (data) => {
        if (!Array.isArray(data)) testingFn(data);
        resolve();
      });
    });

    ioClient1.send(clientMessage);

    ioClient1.disconnect();
    ioClient2.disconnect();
  });

  it('should respond with BAD REQUEST in case of incorrect message', async () => {
    ioClient1.connect();
    ioClient2.connect();

    const clientMessage1 = { usernam: 'vasya', text: "what's up?" };
    const clientMessage2 = { username: 'vasya', text: 2 };

    const obj = { someFn: (data: any) => data };
    const spyFn = jest.spyOn(obj, 'someFn');
    ioClient2.on('exception', obj.someFn);

    ioClient1.send(clientMessage1);
    ioClient1.send(clientMessage2);

    const handle = (data: any) => {
      expect(data.status).toBe(400);
      expect(data.message).toBeDefined();
      expect(spyFn).not.toHaveBeenCalled();
    };

    await new Promise<void>((resolve) => {
      let callCounter = 0;
      ioClient1.on('exception', (error) => {
        handle(error);
        callCounter++;
        if (callCounter === 2) resolve();
      });
    });

    ioClient1.disconnect();
    ioClient2.disconnect();
  });
});
