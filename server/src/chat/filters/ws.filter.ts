import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    if (!(exception instanceof WsException)) {
      super.catch(new WsException(exception), host);
    } else {
      super.catch(exception, host);
    }
  }
}
