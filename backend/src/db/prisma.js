import { PrismaClient } from '@prisma/client';
import env from '../config/env.js';

let prismaInstance;

export function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
    });
  }
  return prismaInstance;
}

export const prisma = getPrismaClient();

/**
 * Verifies live PostgreSQL database connectivity
 * Distinguishes application availability from database reachability.
 * @returns {Promise<{ connected: boolean, latencyMs?: number, error?: string }>}
 */
export async function checkDatabaseConnection(client = prisma) {
  const start = Date.now();
  try {
    // Lightweight raw ping query to verify active connection
    await client.$queryRaw`SELECT 1 as ping`;
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      latencyMs,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message || 'Database connection unreachable',
    };
  }
}

/**
 * Graceful database disconnect handler
 */
export async function disconnectDatabase(client = prisma) {
  try {
    await client.$disconnect();
  } catch (error) {
    console.error('[Prisma Disconnect Error]:', error.message);
  }
}

export default prisma;
