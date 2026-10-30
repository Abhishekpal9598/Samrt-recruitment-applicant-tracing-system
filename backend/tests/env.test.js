import { describe, it, expect } from 'vitest';
import env from '../src/config/env.js';

describe('Environment Configuration Module', () => {
  it('loads valid environment configuration with required keys', () => {
    expect(env).toBeDefined();
    expect(env.NODE_ENV).toMatch(/^(development|production|test)$/);
    expect(typeof env.PORT).toBe('number');
    expect(env.DATABASE_URL).toBeDefined();
    expect(env.CORS_ORIGIN).toBeDefined();
  });

  it('provides safe placeholder defaults for development', () => {
    expect(env.DATABASE_URL).toContain('postgresql://');
    expect(env.JWT_ACCESS_SECRET.length).toBeGreaterThanOrEqual(16);
    expect(env.JWT_REFRESH_SECRET.length).toBeGreaterThanOrEqual(16);
    expect(env.MAX_FILE_SIZE_BYTES).toBe(5242880);
  });

  it('prevents accidental mutation by freezing the env object', () => {
    expect(Object.isFrozen(env)).toBe(true);
    expect(() => {
      // @ts-expect-error - testing immutability
      env.PORT = 9999;
    }).toThrow();
  });
});
