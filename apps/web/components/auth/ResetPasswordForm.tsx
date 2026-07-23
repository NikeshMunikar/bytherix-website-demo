'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, XCircle } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

const schema = z.object({
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })

type F = z.infer<typeof schema>

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [err, setErr]       = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: F) => {
    setErr('')
    if (!token) { setErr('Invalid or missing reset token.'); return }
    try { await apiClient.post('/auth/reset-password', { token, password: data.password }); router.push('/login?reset=success') }
    catch { setErr('Reset link is invalid or has expired.') }
  }

  if (!token) return (
    <div className="text-center py-8">
      <XCircle className="w-14 h-14 text-bx-red mx-auto mb-4" />
      <p className="text-bx-slate">Invalid reset link. Please request a new one.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {err && <div role="alert" className="rounded-xl border border-bx-red/30 bg-bx-red/10 px-4 py-3 text-bx-red text-sm">{err}</div>}
      <div>
        <label htmlFor="new-pw" className="block text-bx-slate text-sm font-medium mb-1.5">New password</label>
        <div className="relative">
          <input id="new-pw" type={showPw ? 'text' : 'password'} autoComplete="new-password" {...register('password')}
            className="w-full px-4 py-2.5 pr-10 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue transition-colors" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-bx-muted" aria-label="Toggle">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="confirm-new-pw" className="block text-bx-slate text-sm font-medium mb-1.5">Confirm password</label>
        <input id="confirm-new-pw" type="password" autoComplete="new-password" {...register('confirmPassword')}
          className="w-full px-4 py-2.5 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue transition-colors" />
        {errors.confirmPassword && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Resetting...' : 'Reset password'}
      </button>
    </form>
  )
}