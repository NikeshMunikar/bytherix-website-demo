'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'

export function DangerZone() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const [confirming, setConfirming] = useState(false)
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await apiClient.delete('/users/me', { data: { password } })
      logout()
      toast.success('Account deleted')
      router.push('/')
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined
      setError(message ?? 'Could not delete your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bx-card rounded-2xl p-6 border border-bx-red/30">
      <h2 className="text-bx-white font-semibold text-base mb-1">Danger zone</h2>
      <p className="text-bx-muted text-xs mb-4">Deleting your account is permanent and cannot be undone.</p>

      {!confirming ? (
        <button onClick={() => setConfirming(true)}
          className="px-4 py-2 rounded-xl border border-bx-red/40 text-bx-red text-sm font-semibold hover:bg-bx-red/10 transition-colors">
          Delete account
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-sm text-bx-red">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>This will permanently delete your account, enrollments, and certificates access. Enter your password to confirm.</p>
          </div>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Current password"
            className="w-full px-4 py-2.5 rounded-xl bg-bx-navy border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-red transition-colors" />
          {error && <p role="alert" className="text-xs text-bx-red">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleDelete} disabled={submitting || !password}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bx-red hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Permanently delete
            </button>
            <button onClick={() => { setConfirming(false); setPassword(''); setError(null) }}
              className="px-4 py-2 rounded-xl border border-bx-border text-bx-slate text-sm font-semibold hover:bg-bx-navy transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
