import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch()
export class ExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (!(exception instanceof RpcException)) {
      return super.catch(new RpcException(exception), host);
    } else {
      return super.catch(exception, host);
    }
  }
}
