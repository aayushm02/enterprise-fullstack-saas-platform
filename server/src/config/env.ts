import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://nexus_user:nexus_password@localhost:5432/nexus_db'),
  JWT_SECRET: z.string().default('enterprise_jwt_super_secret_key_2026_pulse'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[CONFIG ERROR] Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const ENV = parsed.data;
