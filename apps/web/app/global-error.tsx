'use client'
import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <html lang="en">
      <body className="min-h-screen bg-bx-navy flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-5xl mb-4">⚠️</p>
          <h1 className="text-2xl font-bold text-bx-white mb-3">Something went wrong</h1>
          <p className="text-bx-slate text-sm mb-6">An unexpected error occurred.</p>
          {error.digest && <p className="text-bx-muted text-xs font-mono mb-6">ID: {error.digest}</p>}
          <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors">
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </body>
    </html>
  )
}