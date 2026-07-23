'use client'

import { useState, useEffect } from 'react'

interface TerminalTextProps {
  texts: string[]
  typingSpeed?: number
  pauseDuration?: number
}

export function TerminalText({ texts, typingSpeed = 50, pauseDuration = 2000 }: TerminalTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex] ?? ''

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setDisplayText(current.slice(0, charIndex + 1))
          setCharIndex((c) => c + 1)
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration)
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(current.slice(0, charIndex - 1))
          setCharIndex((c) => c - 1)
        } else {
          setIsDeleting(false)
          setTextIndex((i) => (i + 1) % texts.length)
        }
      }
    }, isDeleting ? typingSpeed / 2 : typingSpeed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, pauseDuration])

  return (
    <span>
      {displayText}
      <span className="animate-terminal-blink">_</span>
    </span>
  )
}