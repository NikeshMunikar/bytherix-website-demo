import Redis from 'ioredis'
import { config } from './index'
import { logger } from './logger'

export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest:    3,
  enableReadyCheck:        true,
  lazyConnect:             true,
  retryStrategy: (times) => Math.min(times * 100, 3000),
})

redis.on('connect',       () => logger.info('Redis connected'))
redis.on('ready',         () => logger.info('Redis ready'))
redis.on('error',  (err)  => logger.error({ err }, 'Redis error'))
redis.on('close',         () => logger.warn('Redis connection closed'))
redis.on('reconnecting',  () => logger.info('Redis reconnecting'))

export async function connectRedis(): Promise<void> {
  if (['ready', 'connecting', 'connect'].includes(redis.status)) {
    return
  }
  try {
    await redis.connect()
  } catch (err: any) {
    if (err?.message?.includes('already')) return
    throw err
  }
}