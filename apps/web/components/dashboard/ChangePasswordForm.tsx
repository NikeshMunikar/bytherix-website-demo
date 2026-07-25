'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { isAxiosError } from 'axios'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'

const schema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword:     z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

type F = z.infer<typeof schema>

const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-bx-navy border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue transition-colors'
const labelClass = 'block text-bx-slate text-sm font-medium mb-1.5'

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: F) => {
    setServerError(null)
    try {
      await apiClient.post('/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword })
      toast.success('Password updated — signed out of all devices')
      // Backend revokes all sessions (including this one) on password change
      await new Promise((r) => setTimeout(r, 800))
      logout()
      router.push('/login')
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined
      const finalMessage = message ?? 'Could not change your password. Please try again.'
      setServerError(finalMessage)
      toast.error(finalMessage)
      reset(data, { keepValues: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bx-card rounded-2xl p-6 space-y-4">
      <h2 className="text-bx-white font-semibold text-base">Change password</h2>

      <div>
        <label htmlFor="currentPassword" className={labelClass}>Current password</label>
        <input id="currentPassword" type="password" autoComplete="current-password" {...register('currentPassword')} className={inputClass} />
        {errors.currentPassword && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.currentPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="newPassword" className={labelClass}>New password</label>
        <input id="newPassword" type="password" autoComplete="new-password" {...register('newPassword')} className={inputClass} />
        {errors.newPassword && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.newPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>Confirm new password</label>
        <input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} className={inputClass} />
        {errors.confirmPassword && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.confirmPassword.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="flex items-center gap-2 text-sm text-bx-red">
          <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
        </p>
      )}

      <p className="text-xs text-bx-muted">Changing your password signs you out of all devices, including this one.</p>

      <button type="submit" disabled={isSubmitting}
        className="px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Updating...' : 'Update password'}
      </button>
    </form>
  )
}
