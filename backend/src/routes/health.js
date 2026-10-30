import { Router } from 'express';
import { checkDatabaseConnection } from '../db/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import env from '../config/env.js';

export const healthRouter = Router();

healthRouter.get('/', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();

  const healthPayload = {
    service: 'smart-recruitment-ats-backend',
    version: '1.0.0',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(uptimeSeconds),
    memory: {
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
    },
    database: {
      engine: 'PostgreSQL 15+',
      connected: dbStatus.connected,
      latencyMs: dbStatus.latencyMs ?? null,
      error: dbStatus.error ?? null,
    },
  };

  // Explicit Requirement: Health endpoint must distinguish app availability from DB connectivity.
  // Do not return HTTP 200 for an unhealthy database while reporting the database as healthy.
  if (!dbStatus.connected) {
    return errorResponse(
      res,
      'SERVICE_DEGRADED',
      'The backend service is active, but PostgreSQL database connectivity is currently unavailable or disconnected.',
      503,
      [healthPayload]
    );
  }

  return successResponse(res, {
    status: 'healthy',
    ...healthPayload,
  }, 200);
});

export default healthRouter;
