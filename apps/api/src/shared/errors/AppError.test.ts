import { describe, it, expect } from 'vitest'
import {
  AppError, UnauthorizedError, ForbiddenError, NotFoundError,
  ConflictError, ValidationError, TooManyRequestsError,
} from './AppError'

describe('AppError', () => {
  it('sets message, statusCode, code and defaults isOperational to true', () => {
    const err = new AppError('Something broke', 500, 'BROKEN')
    expect(err.message).toBe('Something broke')
    expect(err.statusCode).toBe(500)
    expect(err.code).toBe('BROKEN')
    expect(err.isOperational).toBe(true)
    expect(err).toBeInstanceOf(Error)
  })

  it('allows marking an error as non-operational', () => {
    const err = new AppError('Unexpected', 500, undefined, false)
    expect(err.isOperational).toBe(false)
    expect(err.code).toBeUndefined()
  })
})

describe('AppError subclasses', () => {
  it('UnauthorizedError defaults to 401', () => {
    const err = new UnauthorizedError()
    expect(err.statusCode).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
    expect(err.message).toBe('Unauthorized')
  })

  it('ForbiddenError defaults to 403', () => {
    const err = new ForbiddenError('No access')
    expect(err.statusCode).toBe(403)
    expect(err.message).toBe('No access')
  })

  it('NotFoundError formats the resource name into the message', () => {
    const err = new NotFoundError('Course')
    expect(err.statusCode).toBe(404)
    expect(err.message).toBe('Course not found')
  })

  it('ConflictError is a 409 with a custom message', () => {
    const err = new ConflictError('Already enrolled')
    expect(err.statusCode).toBe(409)
    expect(err.message).toBe('Already enrolled')
  })

  it('ValidationError is a 422 with a custom message', () => {
    const err = new ValidationError('Invalid payload')
    expect(err.statusCode).toBe(422)
  })

  it('TooManyRequestsError defaults to 429', () => {
    const err = new TooManyRequestsError()
    expect(err.statusCode).toBe(429)
    expect(err.code).toBe('RATE_LIMIT_EXCEEDED')
  })

  it('all subclasses are instances of AppError and Error', () => {
    const errors = [
      new UnauthorizedError(), new ForbiddenError(), new NotFoundError(),
      new ConflictError('x'), new ValidationError('x'), new TooManyRequestsError(),
    ]
    for (const err of errors) {
      expect(err).toBeInstanceOf(AppError)
      expect(err).toBeInstanceOf(Error)
    }
  })
})
