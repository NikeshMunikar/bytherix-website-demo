import 'dotenv/config'
import { app }             from './app'
import { config }          from './config'
import { logger }          from './config/logger'
import { connectDatabase } from './config/database'
import { connectRedis }    from './config/redis'
import http                from 'http'

const server = http.createServer(app)

async function bootstrap(): Promise<void> {
  await connectDatabase()
  await connectRedis()
}

server.listen(config.PORT, () => {
  logger.info(`🚀 Bytherix API running on port ${config.PORT} [${config.NODE_ENV}]`)
})

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err)
})

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection')
  server.close(() => process.exit(1))
})
process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception')
  server.close(() => process.exit(1))
})

async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} — graceful shutdown`)
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}