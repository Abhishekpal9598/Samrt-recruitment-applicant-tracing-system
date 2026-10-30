import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { healthRouter } from '../src/routes/health.js';
import * as prismaModule from '../src/db/prisma.js';

describe('Health Check Endpoint & Database Connectivity Reporting', () => {
  const createTestApp = () => {
    const app = express();
    app.use('/api/health', healthRouter);
    app.use('/api/v1/health', healthRouter);
    return app;
  };

  it('returns HTTP 200 OK and healthy status when database is reachable', async () => {
    // Mock checkDatabaseConnection to return connected
    vi.spyOn(prismaModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: true,
      latencyMs: 12,
    });

    const app = createTestApp();
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.database.connected).toBe(true);
    expect(res.body.data.database.latencyMs).toBe(12);
    expect(res.body.data.database.error).toBeNull();
    expect(typeof res.body.data.uptimeSeconds).toBe('number');
  });

  it('returns HTTP 503 Service Unavailable when database is disconnected or unreachable', async () => {
    // Mock checkDatabaseConnection to return disconnected
    vi.spyOn(prismaModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: false,
      error: 'Can not reach database server at `localhost:5432`',
    });

    const app = createTestApp();
    const res = await request(app).get('/api/health');

    // Rule: Do not return HTTP 200 for an unhealthy database while reporting the database as healthy
    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('SERVICE_DEGRADED');
    expect(res.body.error.message).toContain('database connectivity is currently unavailable');

    const healthDetail = res.body.error.details[0];
    expect(healthDetail.database.connected).toBe(false);
    expect(healthDetail.database.error).toContain('Can not reach database server');
  });

  it('is accessible under both /api/health and /api/v1/health', async () => {
    vi.spyOn(prismaModule, 'checkDatabaseConnection').mockResolvedValueOnce({
      connected: true,
      latencyMs: 5,
    });

    const app = createTestApp();
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
