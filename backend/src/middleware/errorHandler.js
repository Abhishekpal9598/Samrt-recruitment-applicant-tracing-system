import { z } from 'zod';
import { errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';

export function errorHandler(err, req, res, _next) {
  logger.error(err.message || 'Unhandled server error', {
    name: err.name,
    code: err.code,
    stack: env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.originalUrl,
  });

  // 1. Zod Request Validation Error
  if (err instanceof z.ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return errorResponse(res, 'VALIDATION_FAILED', 'Input validation failed against the requested schema contract.', 400, details);
  }

  // 2. Body Parser JSON Syntax Error (Malformed JSON payload)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 'MALFORMED_JSON_PAYLOAD', 'The provided request body is not valid JSON.', 400);
  }

  // 3. CORS Policy Violation
  if (err.message && err.message.includes('CORS policy')) {
    return errorResponse(res, 'CORS_FORBIDDEN', err.message, 403);
  }

  // 4. Prisma Known Request Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    switch (err.code) {
      case 'P2002': {
        const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
        return errorResponse(
          res,
          'RESOURCE_CONFLICT',
          `A resource with this unique ${target} already exists.`,
          409
        );
      }
      case 'P2025':
        return errorResponse(
          res,
          'RESOURCE_NOT_FOUND',
          'The targeted database record was not found or has been removed.',
          404
        );
      default:
        return errorResponse(
          res,
          'DATABASE_ERROR',
          'A database persistence error occurred.',
          400
        );
    }
  }

  // 5. Explicit App Error with status code
  if (err.statusCode || err.status) {
    const statusCode = err.statusCode || err.status;
    const code = err.code || 'BAD_REQUEST';
    return errorResponse(res, code, err.message, statusCode, err.details || []);
  }

  // 6. Generic Internal Server Error (Sanitized in production)
  const message = env.NODE_ENV === 'production'
    ? 'An internal error occurred. Please contact system support with the provided Request ID.'
    : err.message || 'Internal Server Error';

  return errorResponse(res, 'INTERNAL_SERVER_ERROR', message, 500);
}

export default errorHandler;
