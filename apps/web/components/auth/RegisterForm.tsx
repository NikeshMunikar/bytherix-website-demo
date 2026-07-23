'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

const schema = z.object({
  firstName: z.string().min(2).max(50).trim(),
  lastName:  z.string().min(2).max(50).trim(),
  email:     z.string().email('Enter a valid email'),
  password:  z.string().min(8).regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number').regex(/[^A-Za-z0-9]/, 'Needs symbol'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] })

type F = z.infer<typeof schema>

export function RegisterForm() {
  const [showPw, setShowPw] = useState(false)
  const [err, setErr]       = useState('')
  const [ok, setOk]         = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: F) => {
    setErr('')
    try {
      await apiClient.post('/auth/register', { firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password })
      setOk(true)
    } catch { setErr('Registration failed. Try again.') }
  }

  if (ok) return (
    <div className="text-center py-8">
      <CheckCircle className="w-14 h-14 text-bx-green mx-auto mb-4" />
      <h2 className="text-xl font-bold text-bx-white mb-2">Check your email</h2>
      <p className="text-bx-slate text-sm">We sent a verification link. Click it to activate your account.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {err && <div role="alert" className="rounded-xl border border-bx-red/30 bg-bx-red/10 px-4 py-3 text-bx-red text-sm">{err}</div>}

      <div className="grid grid-cols-2 gap-3">
        {(['firstName', 'lastName'] as const).map((f) => (
          <div key={f}>
            <label htmlFor={f} className="block text-bx-slate text-sm font-medium mb-1.5">{f === 'firstName' ? 'First name' : 'Last name'}</label>
            <input id={f} type="text" {...register(f)}
              className="w-full px-4 py-2.5 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue transition-colors" />
            {errors[f] && <p role="alert" className="mt-1 text-xs text-bx-red">{errors[f]?.message}</p>}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-bx-slate text-sm font-medium mb-1.5">Email address</label>
        <input id="reg-email" type="email" autoComplete="email" {...register('email')}
          className="w-full px-4 py-2.5 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue transition-colors"
          placeholder="you@example.com" />
        {errors.email && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="reg-pw" className="block text-bx-slate text-sm font-medium mb-1.5">Password</label>
        <div className="relative">
          <input id="reg-pw" type={showPw ? 'text' : 'password'} autoComplete="new-password" {...register('password')}
            className="w-full px-4 py-2.5 pr-10 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue transition-colors"
            placeholder="Min 8 chars, uppercase, number, symbol" />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-bx-muted hover:text-bx-slate" aria-label="Toggle">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirm-pw" className="block text-bx-slate text-sm font-medium mb-1.5">Confirm password</label>
        <input id="confirm-pw" type="password" autoComplete="new-password" {...register('confirmPassword')}
          className="w-full px-4 py-2.5 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue transition-colors" />
        {errors.confirmPassword && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-center text-bx-slate text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-bx-blue hover:text-bx-blue-light font-medium transition-colors">Sign in</Link>
      </p>
    </form>
  )
}