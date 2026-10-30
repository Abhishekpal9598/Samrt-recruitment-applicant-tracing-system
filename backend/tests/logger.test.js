import { describe, it, expect } from 'vitest';
import { sanitizeLogData } from '../src/utils/logger.js';

describe('Structured Logger Sanitization', () => {
  it('redacts sensitive keys including passwords, tokens, and secrets', () => {
    const rawData = {
      username: 'test_user',
      password: 'SuperSecretPassword123!',
      passwordHash: '$2b$12$somehash',
      token: 'jwt.token.payload',
      refreshToken: 'refresh.token.payload',
      authorization: 'Bearer secret_access_token',
      cookie: 'session_id=12345',
      secret: 'api_secret_key',
      normalField: 'safe public info',
    };

    const sanitized = sanitizeLogData(rawData);

    expect(sanitized.username).toBe('test_user');
    expect(sanitized.normalField).toBe('safe public info');
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.passwordHash).toBe('[REDACTED]');
    expect(sanitized.token).toBe('[REDACTED]');
    expect(sanitized.refreshToken).toBe('[REDACTED]');
    expect(sanitized.authorization).toBe('[REDACTED]');
    expect(sanitized.cookie).toBe('[REDACTED]');
    expect(sanitized.secret).toBe('[REDACTED]');
  });

  it('recursively scrubs nested objects and arrays', () => {
    const nestedData = {
      user: {
        id: 'usr-1',
        credentials: {
          password: 'Secret123!',
        },
      },
      tokens: [{ token: 'abc' }, { normal: 'def' }],
    };

    const sanitized = sanitizeLogData(nestedData);

    expect(sanitized.user.credentials.password).toBe('[REDACTED]');
    expect(sanitized.tokens[0].token).toBe('[REDACTED]');
    expect(sanitized.tokens[1].normal).toBe('def');
  });

  it('handles null, undefined, and non-object values safely', () => {
    expect(sanitizeLogData(null)).toBeNull();
    expect(sanitizeLogData(undefined)).toBeUndefined();
    expect(sanitizeLogData('primitive string')).toBe('primitive string');
    expect(sanitizeLogData(42)).toBe(42);
  });
});
