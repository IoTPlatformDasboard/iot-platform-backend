import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const resBody = exception.getResponse();

    if (status >= 500)
      this.logger.error(`HTTP ${status} - ${JSON.stringify(resBody)}`);
    else if (status >= 400)
      this.logger.warn(`HTTP ${status} - ${JSON.stringify(resBody)}`);

    response.status(status).json(resBody);
  }
}
