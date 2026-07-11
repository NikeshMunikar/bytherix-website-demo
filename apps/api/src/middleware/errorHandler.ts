import type { Request, Response, NextFunction } from 'express'
import * as Sentry                               from '@sentry/node'
import { AppError }                              from '../shared/errors/AppError'
import { logger }                                from '../config/logger'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const cid = req.correlationId

  if (err instanceof AppError && err.isOperational) {
    logger.warn({ err, cid }, 'Operational error')
    res.status(err.statusCode).json({ success: false, error: err.message, code: err.code, correlationId: cid })
    return
  }

  logger.error({ err, cid }, 'Unexpected error')
  Sentry.captureException(err)

  res.status(500).json({ success: false, error: 'Internal server error', correlationId: cid })
}