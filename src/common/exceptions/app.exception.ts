import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum';

export class AppException extends HttpException {
  constructor(
    statusCode: HttpStatus,
    message: string,
    code: ErrorCode | string = ErrorCode.BAD_REQUEST,
    details?: unknown,
  ) {
    super(
      {
        status: false,
        message,
        data: null,
        error: {
          code,
          details: details ?? null,
        },
      },
      statusCode,
    );
  }
}
