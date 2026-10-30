import { Router } from 'express';
import healthRouter from './health.js';
import { successResponse } from '../utils/response.js';

export const v1Router = Router();

// Mount Health Check
v1Router.use('/health', healthRouter);

// Meta index endpoint for /api/v1
v1Router.get('/', (req, res) => {
  return successResponse(res, {
    api: 'Smart Recruitment & Applicant Tracking System API',
    version: 'v1',
    status: 'operational',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth (Phase 3)',
      jobs: '/api/v1/jobs (Phase 3)',
      applications: '/api/v1/applications (Phase 3)',
      interviews: '/api/v1/interviews (Phase 3)',
      offers: '/api/v1/offers (Phase 3)',
      onboarding: '/api/v1/onboarding (Phase 3)',
      analytics: '/api/v1/analytics (Phase 3)',
    },
  });
});

export default v1Router;
