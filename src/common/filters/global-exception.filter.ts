import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/response.interface.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = '서버 오류가 발생했습니다';

    // 의도한 예외(HttpException)가 아닌 경우, 원인을 알 수 있도록 스택까지 남깁니다.
    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `${request.method} ${request.url} - 처리되지 않은 예외`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>;

        // CommonException 형식
        if (res.code) {
          code = res.code as string;
          message = res.message as string;
        }
        // ValidationPipe 형식
        else if (Array.isArray(res.message)) {
          code = 'VALIDATION_ERROR';
          message = (res.message as string[]).join(', ');
        }
        // HttpException
        else {
          code = `HTTP_${status}`;
          message = (res.message as string) || exception.message;
        }
      }
    }

    const errorResponse: ErrorResponse = {
      status: status,
      code,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
