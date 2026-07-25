'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Monitor, MapPin, Clock, X, AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSessions, useRevokeSession } from '@/hooks/useSessions'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'

function describeDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  const browser = ua.includes('edg/') ? 'Edge' : ua.includes('chrome') ? 'Chrome' : ua.includes('firefox') ? 'Firefox' : ua.includes('safari') ? 'Safari' : 'Unknown browser'
  const os = ua.includes('windows') ? 'Windows' : ua.includes('mac') ? 'macOS' : ua.includes('android') ? 'Android' : ua.includes('iphone') || ua.includes('ipad') ? 'iOS' : ua.includes('linux') ? 'Linux' : 'Unknown OS'
  return `${browser} on ${os}`
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function SessionsList() {
  const { data: sessions, isLoading, isError, refetch } = useSessions()
  const revoke = useRevokeSession()
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const [signingOutAll, setSigningOutAll] = useState(false)

  const signOutEverywhere = async () => {
    setSigningOutAll(true)
    try {
      await apiClient.post('/auth/logout-all')
      toast.success('Signed out of all devices')
    } catch {
      toast.error('Could not sign out of all devices')
    } finally {
      logout()
      router.push('/login')
    }
  }

  if (isLoading) {
    return (
      <div className="bx-card rounded-2xl p-6 space-y-3 animate-pulse">
        <div className="h-4 w-1/3 bg-bx-border rounded" />
        <div className="h-14 w-full bg-bx-border rounded-xl" />
        <div className="h-14 w-full bg-bx-border rounded-xl" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bx-card rounded-2xl p-6 text-center">
        <AlertTriangle className="w-6 h-6 text-bx-red mx-auto mb-2" />
        <p className="text-bx-slate text-sm mb-3">Couldn&apos;t load active sessions.</p>
        <button onClick={() => refetch()} className="text-sm font-semibold text-bx-blue-light">Try again</button>
      </div>
    )
  }

  return (
    <div className="bx-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-bx-white font-semibold text-base">Active sessions</h2>
        <button onClick={signOutEverywhere} disabled={signingOutAll}
          className="flex items-center gap-1.5 text-xs font-semibold text-bx-red hover:text-red-400 transition-colors disabled:opacity-50">
          {signingOutAll && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Sign out everywhere
        </button>
      </div>

      <div className="space-y-3">
        {(sessions ?? []).map((s) => (
          <div key={s._id} className="flex items-center gap-3 rounded-xl border border-bx-border p-3">
            <div className="w-9 h-9 rounded-lg bg-bx-blue/15 flex items-center justify-center text-bx-blue-light shrink-0">
              <Monitor className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-bx-white text-sm font-medium truncate">{describeDevice(s.userAgent)}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-bx-muted"><MapPin className="w-3 h-3" /> {s.ip || 'Unknown IP'}</span>
                <span className="flex items-center gap-1 text-xs text-bx-muted"><Clock className="w-3 h-3" /> active {timeAgo(s.lastUsedAt)}</span>
              </div>
            </div>
            <button onClick={() => revoke.mutate(s._id, {
                onSuccess: () => toast.success('Session revoked'),
                onError:   () => toast.error('Could not revoke session'),
              })} disabled={revoke.isPending}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-bx-muted hover:text-bx-red hover:bg-bx-red/10 transition-colors disabled:opacity-50"
              aria-label="Revoke session">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {sessions?.length === 0 && <p className="text-bx-muted text-sm">No other active sessions.</p>}
      </div>
    </div>
  )
}
