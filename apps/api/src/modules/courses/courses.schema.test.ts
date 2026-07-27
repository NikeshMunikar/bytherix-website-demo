import { describe, it, expect } from 'vitest'
import { listCoursesSchema, idParamSchema, createCourseSchema } from './courses.schema'

describe('listCoursesSchema', () => {
  it('applies default page and limit when omitted', () => {
    const result = listCoursesSchema.query.parse({})
    expect(result.page).toBe(1)
    expect(result.limit).toBe(12)
  })

  it('coerces page/limit/featured from query-string values', () => {
    const result = listCoursesSchema.query.parse({ page: '2', limit: '5', featured: 'true' })
    expect(result.page).toBe(2)
    expect(result.limit).toBe(5)
    expect(result.featured).toBe(true)
  })

  it('rejects a limit above the max', () => {
    const result = listCoursesSchema.query.safeParse({ limit: '500' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid level', () => {
    const result = listCoursesSchema.query.safeParse({ level: 'EXPERT' })
    expect(result.success).toBe(false)
  })
})

describe('idParamSchema', () => {
  it('accepts a valid 24-char hex ObjectId', () => {
    const result = idParamSchema.params.safeParse({ id: '507f1f77bcf86cd799439011' })
    expect(result.success).toBe(true)
  })

  it('rejects a malformed id', () => {
    const result = idParamSchema.params.safeParse({ id: 'not-an-id' })
    expect(result.success).toBe(false)
  })
})

describe('createCourseSchema', () => {
  const valid = {
    title: 'Intro to TypeScript',
    description: 'A course covering the fundamentals of TypeScript in depth.',
    thumbnail: 'https://example.com/thumb.jpg',
    category: 'Web Development',
    price: 1000,
    originalPrice: 1500,
    duration: 10,
    level: 'BEGINNER' as const,
  }

  it('accepts a valid course payload', () => {
    const result = createCourseSchema.body.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects a negative price', () => {
    const result = createCourseSchema.body.safeParse({ ...valid, price: -10 })
    expect(result.success).toBe(false)
  })

  it('rejects a non-url thumbnail', () => {
    const result = createCourseSchema.body.safeParse({ ...valid, thumbnail: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid slug format when provided', () => {
    const result = createCourseSchema.body.safeParse({ ...valid, slug: 'Not A Valid Slug!' })
    expect(result.success).toBe(false)
  })
})
