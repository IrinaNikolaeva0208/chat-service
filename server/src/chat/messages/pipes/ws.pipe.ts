import { ValidationPipe, ArgumentMetadata } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class WsPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      if (typeof value != 'string')
        return await super.transform(value, metadata);
      else {
        const body = JSON.parse(value);
        return await super.transform(body, metadata);
      }
    } catch (e) {
      throw new WsException(e);
    }
  }
}
