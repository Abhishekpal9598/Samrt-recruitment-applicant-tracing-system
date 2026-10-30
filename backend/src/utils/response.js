/**
 * Standard API Response Envelopes conforming to docs/API_DOCUMENTATION.md
 */

export function successResponse(res, data = {}, statusCode = 200, meta = {}) {
  const requestId = res.locals?.requestId || `req-${Math.random().toString(36).substring(2, 10)}`;
  const timestamp = new Date().toISOString();

  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
    meta: {
      timestamp,
      requestId,
      ...meta,
    },
  });
}

export function errorResponse(res, code = 'INTERNAL_SERVER_ERROR', message = 'An unexpected error occurred.', statusCode = 500, details = []) {
  const requestId = res.locals?.requestId || `req-${Math.random().toString(36).substring(2, 10)}`;
  const timestamp = new Date().toISOString();

  return res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code,
      message,
      details: Array.isArray(details) ? details : [details],
    },
    meta: {
      timestamp,
      requestId,
    },
  });
}
