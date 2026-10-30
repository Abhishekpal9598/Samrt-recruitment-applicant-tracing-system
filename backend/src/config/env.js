import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file if present
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().default('postgresql://ats_user:ats_password_placeholder@localhost:5432/smart_ats_db?schema=public'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  JWT_ACCESS_SECRET: z.string().min(16).default('placeholder_access_secret_for_development_purposes_only_32_chars_min'),
  JWT_REFRESH_SECRET: z.string().min(16).default('placeholder_refresh_secret_for_development_purposes_only_32_chars_min'),
  JWT_ACCESS_EXPIRATION: z.string().default('15m'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  MAX_FILE_SIZE_BYTES: z.coerce.number().default(5242880),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

let parsedEnv;
try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const errorDetails = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    console.error(`[Config Error] Invalid environment configuration: ${errorDetails}`);
  }
  // In development/test, fallback to defaults
  parsedEnv = envSchema.parse({});
}

export const env = Object.freeze(parsedEnv);
export default env;
