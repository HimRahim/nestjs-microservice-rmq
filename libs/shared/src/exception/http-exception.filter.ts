import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status: any =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception.status != null && typeof exception.status == 'number'
        ? exception.status
        : 500;

    res.status(status).json({
      statusCode: status,
      exception: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
