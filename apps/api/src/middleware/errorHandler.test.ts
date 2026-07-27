import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Request, Response } from 'express'

vi.mock('@sentry/node', () => ({ captureException: vi.fn() }))
vi.mock('../config/logger', () => ({
  logger: { warn: vi.fn(), error: vi.fn() },
}))

import { errorHandler } from './errorHandler'
import { NotFoundError } from '../shared/errors/AppError'
import * as Sentry from '@sentry/node'

function makeRes() {
  const res: Partial<Response> = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res as Response
}

const req = { correlationId: 'test-cid' } as unknown as Request

beforeEach(() => {
  vi.clearAllMocks()
})

describe('errorHandler', () => {
  it('passes through an operational AppError with its own status/code', () => {
    const res = makeRes()
    errorHandler(new NotFoundError('Course'), req, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false, error: 'Course not found', code: 'NOT_FOUND', correlationId: 'test-cid',
    }))
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  it('maps a MongoDB duplicate-key error on email to a friendly 409', () => {
    const res = makeRes()
    const dupError = Object.assign(new Error('E11000 duplicate key'), {
      name: 'MongoServerError', code: 11000, keyValue: { email: 'a@b.com' },
    })

    errorHandler(dupError, req, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false, error: 'An account with this email already exists', code: 'CONFLICT',
    }))
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  it('maps a MongoDB duplicate-key error on an unrecognized field to a generic conflict message', () => {
    const res = makeRes()
    const dupError = Object.assign(new Error('E11000 duplicate key'), {
      name: 'MongoServerError', code: 11000, keyValue: { someOtherField: 'x' },
    })

    errorHandler(dupError, req, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'A record with this someOtherField already exists',
    }))
  })

  it('maps a Mongoose ValidationError to a 422', () => {
    const res = makeRes()
    const validationError = Object.assign(new Error('Path `title` is required'), { name: 'ValidationError' })

    errorHandler(validationError, req, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'VALIDATION_ERROR' }))
  })

  it('maps a Mongoose CastError to a 422', () => {
    const res = makeRes()
    const castError = Object.assign(new Error('Cast to ObjectId failed'), { name: 'CastError' })

    errorHandler(castError, req, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(422)
  })

  it('falls back to a generic 500 and reports to Sentry for a truly unexpected error', () => {
    const res = makeRes()
    const unexpected = new Error('Something exploded')

    errorHandler(unexpected, req, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false, error: 'Internal server error', correlationId: 'test-cid',
    }))
    expect(Sentry.captureException).toHaveBeenCalledWith(unexpected)
  })

  it('never leaks the raw internal error message for a 500', () => {
    const res = makeRes()
    errorHandler(new Error('sensitive stack trace details'), req, res, vi.fn())

    const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(payload.error).not.toContain('sensitive stack trace details')
  })
})
