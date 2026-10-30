import logger from '../utils/logger.js';

export function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || `req-${Math.random().toString(36).substring(2, 10)}`;
  res.locals.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'] || 'Unknown',
    };

    if (res.statusCode >= 500) {
      logger.error(`HTTP ${req.method} ${req.url} failed`, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(`HTTP ${req.method} ${req.url} client warning`, logData);
    } else {
      logger.info(`HTTP ${req.method} ${req.url} completed`, logData);
    }
  });

  next();
}

export default requestLogger;
