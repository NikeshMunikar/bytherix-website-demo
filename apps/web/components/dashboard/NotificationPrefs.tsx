'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'

export function NotificationPrefs() {
  const { user, setUser } = useAuthStore()
  const [saving, setSaving] = useState(false)

  if (!user) return null

  const toggle = async () => {
    const next = !(user.emailNotifications ?? true)
    setSaving(true)
    try {
      const { data } = await apiClient.put('/users/me', { emailNotifications: next })
      setUser(data.data)
      toast.success(next ? 'Email notifications turned on' : 'Email notifications turned off')
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined
      toast.error(message ?? 'Could not update preference')
    } finally {
      setSaving(false)
    }
  }

  const enabled = user.emailNotifications ?? true

  return (
    <div className="bx-card rounded-2xl p-6">
      <h2 className="text-bx-white font-semibold text-base mb-4">Notifications</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-bx-white text-sm font-medium">Email notifications</p>
          <p className="text-bx-muted text-xs mt-0.5">Course updates, enrollment receipts, and account alerts.</p>
        </div>
        <button onClick={toggle} disabled={saving} role="switch" aria-checked={enabled}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${enabled ? 'bg-bx-blue' : 'bg-bx-border'} disabled:opacity-50`}>
          {saving
            ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin absolute top-1.25 left-1/2 -translate-x-1/2" />
            : <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />}
        </button>
      </div>
    </div>
  )
}
