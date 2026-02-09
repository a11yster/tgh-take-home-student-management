import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorCode } from '../exceptions/error-code.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const normalized = this.normalizeExceptionResponse(
      statusCode,
      exceptionResponse,
      exception,
    );

    response.status(statusCode).json(normalized);
  }

  private normalizeExceptionResponse(
    statusCode: number,
    exceptionResponse: unknown,
    exception: unknown,
  ) {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as Record<string, any>;
      const messageValue = responseObj.message;

      return {
        status: false,
        message: Array.isArray(messageValue)
          ? 'Validation failed'
          : messageValue || 'Request failed',
        data: null,
        error: {
          code: responseObj?.error?.code || this.mapStatusCodeToErrorCode(statusCode),
          details:
            responseObj?.error?.details ??
            (Array.isArray(messageValue) ? messageValue : null),
        },
      };
    }

    return {
      status: false,
      message:
        exception instanceof Error ? exception.message : 'Internal server error',
      data: null,
      error: {
        code: this.mapStatusCodeToErrorCode(statusCode),
        details: null,
      },
    };
  }

  private mapStatusCodeToErrorCode(statusCode: number): ErrorCode {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}
