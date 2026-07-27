import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 400))
    expect(result.current).toBe('initial')
  })

  it('does not update before the delay has elapsed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    })
    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('a')
  })

  it('updates to the latest value once the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    })
    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(400))
    expect(result.current).toBe('b')
  })

  it('resets the timer on rapid successive changes (only settles on the final value)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: 'a' },
    })
    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'c' })
    act(() => vi.advanceTimersByTime(200))
    // Only 200ms since the last change ('c') — hasn't settled yet
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('c')
  })
})
