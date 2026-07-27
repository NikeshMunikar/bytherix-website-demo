'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'

export function VerifyLookupForm() {
  const router = useRouter()
  const [value, setValue] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) router.push(`/certificates/verify/${encodeURIComponent(value.trim())}`)
  }

  return (
    <form onSubmit={onSubmit} className="bx-card rounded-2xl p-8 max-w-md w-full text-center">
      <div className="w-14 h-14 rounded-2xl bg-bx-blue/15 flex items-center justify-center mx-auto mb-4">
        <ShieldCheck className="w-7 h-7 text-bx-blue-light" />
      </div>
      <p className="text-bx-white font-semibold text-lg mb-1">Verify a Certificate</p>
      <p className="text-bx-slate text-sm mb-6">Enter the certificate number found at the bottom of a Bytherix certificate.</p>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="BX-2026-XXXXXXXX"
        className="w-full px-4 py-2.5 rounded-xl bg-bx-navy border border-bx-border text-bx-white placeholder:text-bx-muted text-sm text-center font-mono focus:outline-none focus:border-bx-blue transition-colors mb-4" />
      <button type="submit" className="w-full py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors">
        Verify
      </button>
    </form>
  )
}
