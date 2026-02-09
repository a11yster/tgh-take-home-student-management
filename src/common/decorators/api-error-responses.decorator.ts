import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

type ApiErrorResponseOptions = {
  badRequest?: boolean;
  unauthorized?: boolean;
  forbidden?: boolean;
  notFound?: boolean;
  conflict?: boolean;
  internalServerError?: boolean;
};

const buildErrorSchema = (
  message: string,
  code: string,
  details: unknown = null,
) => ({
  example: {
    status: false,
    message,
    data: null,
    error: {
      code,
      details,
    },
  },
});

export const ApiErrorResponses = (options: ApiErrorResponseOptions = {}) => {
  const {
    badRequest = true,
    unauthorized = false,
    forbidden = false,
    notFound = false,
    conflict = false,
    internalServerError = true,
  } = options;

  const decorators = [];

  if (badRequest) {
    decorators.push(
      ApiBadRequestResponse({
        schema: buildErrorSchema('Validation failed', 'VALIDATION_ERROR', [
          {
            field: 'email',
            errors: ['email must be an email'],
          },
        ]),
      }),
    );
  }

  if (unauthorized) {
    decorators.push(
      ApiUnauthorizedResponse({
        schema: buildErrorSchema('Invalid or expired token', 'UNAUTHORIZED'),
      }),
    );
  }

  if (forbidden) {
    decorators.push(
      ApiForbiddenResponse({
        schema: buildErrorSchema('Forbidden resource', 'FORBIDDEN'),
      }),
    );
  }

  if (notFound) {
    decorators.push(
      ApiNotFoundResponse({
        schema: buildErrorSchema('Resource not found', 'NOT_FOUND'),
      }),
    );
  }

  if (conflict) {
    decorators.push(
      ApiConflictResponse({
        schema: buildErrorSchema('Email ID already exists', 'CONFLICT'),
      }),
    );
  }

  if (internalServerError) {
    decorators.push(
      ApiInternalServerErrorResponse({
        schema: buildErrorSchema(
          'Internal server error',
          'INTERNAL_SERVER_ERROR',
        ),
      }),
    );
  }

  return applyDecorators(...decorators);
};
