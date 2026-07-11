import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV:                z.enum(['development', 'production', 'test']).default('development'),
  PORT:                    z.coerce.number().default(5000),
  MONGODB_URI:             z.string().min(1),
  REDIS_URL:               z.string().min(1),
  JWT_ACCESS_SECRET:       z.string().min(32),
  JWT_REFRESH_SECRET:      z.string().min(32),
  JWT_ACCESS_EXPIRES_IN:   z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN:  z.string().default('7d'),
  COOKIE_SECRET:           z.string().min(32),
  CLIENT_URL:              z.string().url().default('http://localhost:3000'),
  SMTP_HOST:               z.string().default('smtp.gmail.com'),
  SMTP_PORT:               z.coerce.number().default(587),
  SMTP_USER:               z.string().default(''),
  SMTP_PASS:               z.string().default(''),
  SMTP_FROM:               z.string().default('noreply@bytherix.com'),
  SENTRY_DSN:              z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

export const config = parsed.data
export type Config  = typeof config