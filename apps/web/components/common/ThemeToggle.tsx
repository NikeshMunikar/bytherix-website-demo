'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  // Reading localStorage/matchMedia must happen after mount (SSR has neither),
  // so this synchronization can't be moved out of an effect.
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(isDark)
    document.documentElement.classList.toggle('light', !isDark)
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('light', !next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="btn btn-ghost w-9 h-9 p-0 rounded-lg"
    >
      {dark
        ? <Sun  className="w-4 h-4" />
        : <Moon className="w-4 h-4" />
      }
    </button>
  )
}