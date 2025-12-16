import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorInfo {
  code: string;
  message: string;
  status: HttpStatus;
}

export class CommonException extends HttpException {
  constructor(error: ErrorInfo) {
    super(
      {
        code: error.code,
        message: error.message,
      },
      error.status,
    );
  }
}
