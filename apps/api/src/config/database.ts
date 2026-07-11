import mongoose from 'mongoose'
import { config } from './index'
import { logger } from './logger'

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(config.MONGODB_URI, {
      maxPoolSize:               10,
      minPoolSize:               2,
      serverSelectionTimeoutMS:  5000,
      socketTimeoutMS:           45000,
      heartbeatFrequencyMS:      10000,
    })
    logger.info('MongoDB connected')
  } catch (err) {
    logger.error({ err }, 'MongoDB connection failed')
    process.exit(1)
  }

  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))
  mongoose.connection.on('reconnected',  () => logger.info('MongoDB reconnected'))
  mongoose.connection.on('error', (err)  => logger.error({ err }, 'MongoDB error'))
}