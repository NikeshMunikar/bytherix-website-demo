import { config } from '../../config'
import type { ConnectionOptions } from 'bullmq'

function parseRedisUrl(redisUrl: string) {
  const u = new URL(redisUrl)
  return {
    host:     u.hostname,
    port:     u.port ? Number(u.port) : 6379,
    username: u.username || undefined,
    password: u.password || undefined,
  }
}

// BullMQ ships its own bundled ioredis, which is a distinct package instance
// from the app's top-level ioredis (config/redis.ts) and not type-compatible
// with it. Passing plain connection options instead of a Redis instance lets
// BullMQ manage its own client internally and sidesteps that mismatch.
// BullMQ also requires maxRetriesPerRequest: null — it manages retries itself.
export const emailConnectionOptions: ConnectionOptions = {
  ...parseRedisUrl(config.REDIS_URL),
  maxRetriesPerRequest: null,
}
