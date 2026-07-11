import pino from 'pino'
import { config } from './index'

export const logger = pino({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  base:  { service: 'bytherix-api', env: config.NODE_ENV },
  // Redact sensitive fields from logs
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.currentPassword',
      'req.body.newPassword',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
  ...(config.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
    },
  }),
})