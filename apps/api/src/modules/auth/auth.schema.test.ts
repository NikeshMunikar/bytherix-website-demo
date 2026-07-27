import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema } from './auth.schema'

describe('registerSchema', () => {
  const valid = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', password: 'Str0ng!Pass' }

  it('accepts a valid registration payload', () => {
    const result = registerSchema.body.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('lowercases the email', () => {
    const result = registerSchema.body.parse({ ...valid, email: 'ADA@EXAMPLE.COM' })
    expect(result.email).toBe('ada@example.com')
  })

  it.each([
    ['no uppercase',       'str0ng!pass'],
    ['no lowercase',       'STR0NG!PASS'],
    ['no number',          'Strong!Pass'],
    ['no special char',    'Str0ngPassw'],
    ['too short',          'S1!aB2'],
  ])('rejects a password that is %s', (_label, password) => {
    const result = registerSchema.body.safeParse({ ...valid, password })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = registerSchema.body.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects a first name that is too short', () => {
    const result = registerSchema.body.safeParse({ ...valid, firstName: 'A' })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts a valid login payload', () => {
    const result = loginSchema.body.safeParse({ email: 'a@b.com', password: 'anything' })
    expect(result.success).toBe(true)
  })

  it('rejects a missing password', () => {
    const result = loginSchema.body.safeParse({ email: 'a@b.com' })
    expect(result.success).toBe(false)
  })
})
