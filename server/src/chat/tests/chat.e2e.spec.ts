import { Socket, io } from 'socket.io-client';
import { Test } from '@nestjs/testing';
import { ChatModule } from '../chat.module';
import { MessageRepository } from '../message.repository';
import { INestApplication } from '@nestjs/common';
import {
  db,
  messageRepo,
  correctMessage,
  incorrectMessage1,
  incorrectMessage2,
  cookieUsername,
} from './utils';

describe('Chat', () => {
  let app: INestApplication;
  let ioClient1: Socket;
  let ioClient2: Socket;
  let ioClient3: Socket;

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
      extraHeaders: {
        cookie:
          'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkV4Y2VwdGV1ciIsImlhdCI6MTcwOTM5ODM2MywiZXhwIjoxNzQwOTM0MzYzfQ.ItuVad5o0gKmzB-PcXl2RD4ClCoxVs-rXNupTgU1QiI; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkV4Y2VwdGV1ciIsImlhdCI6MTcwOTM5ODM2MywiZXhwIjoxNzA5NDg0NzYzfQ.b1yipPEo7ilJExoCeb2MGq2UeG7Z4wQnETPSi3hcrug',
      },
    });

    ioClient2 = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    ioClient3 = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      extraHeaders: {
        cookie:
          'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkV4Y2VwdGV1ciIsImlhdCI6MTcwOTM5ODM2MywiZXhwIjoxNzQwOTM0MzYzfQ.ItuVad5o0gKmzB-PcXl2RD4ClCoxVs-rXNupTgU1QiI; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkV4Y2VwdGV1ciIsImlhdCI6MTcwOTM5ODM2MywiZXhwIjoxNzA5NDg0NzYzfQ.b1yipPEo7ilJExoCeb2MGq2UeG7Z4wQnETPSi3hcrug',
      },
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

    const testingFn = (data) => {
      expect(data.username).toBe(cookieUsername);
      expect(data.text).toBe(correctMessage.text);
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

    ioClient1.send(correctMessage);

    ioClient1.disconnect();
    ioClient2.disconnect();
  });

  it('should respond with BAD REQUEST in case of incorrect message', async () => {
    ioClient1.connect();
    ioClient2.connect();

    const obj = { someFn: (data: any) => data };
    const spyFn = jest.spyOn(obj, 'someFn');
    ioClient2.on('exception', obj.someFn);

    ioClient1.send(incorrectMessage1);
    ioClient1.send(incorrectMessage2);

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

  it('should respond with ERROR in case of invalid token', async () => {
    ioClient3.connect();

    ioClient3.on('exception', (data: any) => {
      expect(data.status).toBe('error');
      expect(data.message).toBeDefined();
    });

    ioClient3.send(incorrectMessage1);

    ioClient3.disconnect();
  });
});
