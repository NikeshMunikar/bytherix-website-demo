import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, slugify } from './utils'

describe('cn', () => {
  it('merges class names, with later Tailwind classes winning conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('drops falsy values', () => {
    expect(cn('base', false, undefined, null, 'extra')).toBe('base extra')
  })
})

describe('formatCurrency', () => {
  it('formats an amount with the default currency (INR)', () => {
    expect(formatCurrency(1000)).toContain('1,000')
  })

  it('formats with a custom currency code', () => {
    const result = formatCurrency(500, 'NPR')
    expect(result).toContain('500')
  })

  it('rounds to whole units (no decimals)', () => {
    const result = formatCurrency(999.5, 'USD')
    expect(result).not.toContain('.5')
  })
})

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Intro to TypeScript')).toBe('intro-to-typescript')
  })

  it('strips special characters', () => {
    expect(slugify('Node.js & Express!')).toBe('node-js-express')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --Hello World--  ')).toBe('hello-world')
  })

  it('collapses multiple separators into one hyphen', () => {
    expect(slugify('a   b---c')).toBe('a-b-c')
  })
})
