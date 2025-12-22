import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../interfaces/response.interface.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = '서버 오류가 발생했습니다';

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
      status: 'error',
      code,
      message,
    };

    response.status(status).json(errorResponse);
  }
}
