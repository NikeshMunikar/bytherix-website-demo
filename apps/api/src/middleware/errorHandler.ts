import type { Request, Response, NextFunction } from 'express'
import * as Sentry                               from '@sentry/node'
import { AppError, ConflictError, ValidationError } from '../shared/errors/AppError'
import { logger }                                from '../config/logger'

interface MongoDuplicateKeyError extends Error {
  code: number
  keyValue?: Record<string, unknown>
}

function isMongoDuplicateKeyError(err: Error): err is MongoDuplicateKeyError {
  return err.name === 'MongoServerError' && (err as MongoDuplicateKeyError).code === 11000
}

function friendlyDuplicateKeyMessage(err: MongoDuplicateKeyError): string {
  const field = err.keyValue ? Object.keys(err.keyValue)[0] : undefined
  if (field === 'email')            return 'An account with this email already exists'
  if (field === 'slug')             return 'This slug is already in use'
  if (field === 'transactionUuid')  return 'This transaction has already been processed'
  if (field === 'certificateNumber') return 'This certificate number is already in use'
  return field ? `A record with this ${field} already exists` : 'This record already exists'
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const cid = req.correlationId

  if (err instanceof AppError && err.isOperational) {
    logger.warn({ err, cid }, 'Operational error')
    res.status(err.statusCode).json({ success: false, error: err.message, code: err.code, correlationId: cid })
    return
  }

  // A unique-index race (e.g. two concurrent enroll/register/create requests
  // both pass the app-level uniqueness check before either write lands) is an
  // expected, recoverable condition — not a 500.
  if (isMongoDuplicateKeyError(err)) {
    const mapped = new ConflictError(friendlyDuplicateKeyMessage(err))
    logger.warn({ err, cid }, 'Duplicate key — mapped to ConflictError')
    res.status(mapped.statusCode).json({ success: false, error: mapped.message, code: mapped.code, correlationId: cid })
    return
  }

  // Defense in depth: a raw Mongoose schema validation error escaping past
  // the Zod layer (e.g. a service constructing data by hand) is a client
  // input problem, not a server fault.
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    const mapped = new ValidationError(err.message)
    logger.warn({ err, cid }, 'Mongoose validation/cast error — mapped to ValidationError')
    res.status(mapped.statusCode).json({ success: false, error: mapped.message, code: mapped.code, correlationId: cid })
    return
  }

  logger.error({ err, cid }, 'Unexpected error')
  Sentry.captureException(err)

  res.status(500).json({ success: false, error: 'Internal server error', correlationId: cid })
}