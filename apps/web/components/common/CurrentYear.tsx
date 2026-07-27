'use client'
import { useEffect, useState } from 'react'

export function CurrentYear() {
  const [year, setYear] = useState(2026)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- current time can only be read client-side; this keeps the copyright year accurate without blocking static prerendering
    setYear(new Date().getFullYear())
  }, [])

  return <>{year}</>
}
