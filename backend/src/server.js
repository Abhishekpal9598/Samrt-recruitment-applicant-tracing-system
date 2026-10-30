import app from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';
import { disconnectDatabase, checkDatabaseConnection } from './db/prisma.js';

const PORT = env.PORT;
const HOST = env.HOST;

export const server = app.listen(PORT, HOST, async () => {
  logger.info(`[Server Startup] Smart Recruitment ATS Backend operational`, {
    port: PORT,
    host: HOST,
    environment: env.NODE_ENV,
    url: `http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`,
    apiRoot: `http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/v1`,
    healthEndpoint: `http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/health`,
  });

  // Check initial database connectivity status on boot
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    logger.info(`[Database] PostgreSQL connection established successfully (${dbStatus.latencyMs}ms)`);
  } else {
    logger.warn(`[Database] PostgreSQL connection pending or unreachable: ${dbStatus.error}`);
  }
});

// Graceful Shutdown Handlers
async function handleGracefulShutdown(signal) {
  logger.info(`[Shutdown] Received ${signal}. Commencing graceful service termination...`);

  server.close(async () => {
    logger.info('[Shutdown] HTTP connection listener terminated.');
    await disconnectDatabase();
    logger.info('[Shutdown] Database connection pool disconnected.');
    process.exit(0);
  });

  // Force shutdown after timeout if pending connections do not drain
  setTimeout(() => {
    logger.error('[Shutdown Error] Graceful shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default server;
