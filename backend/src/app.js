import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import corsOptions from './config/cors.js';
import requestLogger from './middleware/requestLogger.js';
import notFoundHandler from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import v1Router from './routes/index.js';
import healthRouter from './routes/health.js';

export function createApp() {
  const app = express();

  // 1. Foundational Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'blob:'],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // 2. CORS Configuration from Environment
  app.use(cors(corsOptions));

  // 3. Structured Request Logger
  app.use(requestLogger);

  // 4. Request Body Parsers with Controlled Payload Limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 5. Root Health Endpoint (Direct probe support for load balancers & orchestrators)
  app.use('/api/health', healthRouter);

  // 6. Centralized API v1 Routes
  app.use('/api/v1', v1Router);

  // 7. 404 Catch-All Handler
  app.use(notFoundHandler);

  // 8. Centralized Error-Handling Middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
export default app;
