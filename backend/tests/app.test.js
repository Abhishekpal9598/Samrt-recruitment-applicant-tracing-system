import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Express Application Foundation & Security Middleware', () => {
  it('applies foundational security headers via Helmet', async () => {
    const res = await request(app).get('/api/v1');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('provides X-Request-Id header in responses for distributed traceability', async () => {
    const res = await request(app).get('/api/v1');

    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.headers['x-request-id']).toMatch(/^req-/);
    expect(res.body.meta?.requestId).toBe(res.headers['x-request-id']);
  });

  it('returns standard meta index payload at /api/v1', async () => {
    const res = await request(app).get('/api/v1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.api).toContain('Smart Recruitment');
    expect(res.body.data.endpoints.health).toBe('/api/v1/health');
  });

  it('handles 404 for unknown routes with standard error envelope', async () => {
    const res = await request(app).get('/api/v1/non-existent-route-endpoint');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBeNull();
    expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
    expect(res.body.error.message).toContain('non-existent-route-endpoint');
    expect(res.body.meta.timestamp).toBeDefined();
  });

  it('rejects malformed JSON payloads with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/v1')
      .set('Content-Type', 'application/json')
      .send('{"invalidJson": "broken,');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('MALFORMED_JSON_PAYLOAD');
  });
});
