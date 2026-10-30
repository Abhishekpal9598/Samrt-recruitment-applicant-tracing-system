import env from '../config/env.js';

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'refreshtoken',
  'accesstoken',
  'authorization',
  'cookie',
  'secret',
  'creditcard',
]);

/**
 * Recursively scrubs sensitive credentials and personal identifiers from log payloads
 */
export function sanitizeLogData(data) {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item));
  }

  const sanitized = {};
  for (const [key, val] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitizeLogData(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevelPriority = LOG_LEVELS[env.LOG_LEVEL] ?? 2;

export const logger = {
  error: (message, meta = {}) => {
    if (LOG_LEVELS.error <= currentLevelPriority) {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'ERROR',
          message,
          ...sanitizeLogData(meta),
        })
      );
    }
  },
  warn: (message, meta = {}) => {
    if (LOG_LEVELS.warn <= currentLevelPriority) {
      console.warn(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'WARN',
          message,
          ...sanitizeLogData(meta),
        })
      );
    }
  },
  info: (message, meta = {}) => {
    if (LOG_LEVELS.info <= currentLevelPriority) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message,
          ...sanitizeLogData(meta),
        })
      );
    }
  },
  debug: (message, meta = {}) => {
    if (LOG_LEVELS.debug <= currentLevelPriority) {
      console.debug(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'DEBUG',
          message,
          ...sanitizeLogData(meta),
        })
      );
    }
  },
};

export default logger;
