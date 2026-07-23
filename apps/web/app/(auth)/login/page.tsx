import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign In', robots: { index: false, follow: false } }

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-bx-white mb-2">Welcome back</h1>
        <p className="text-bx-slate text-sm">Sign in to continue learning</p>
      </div>
      <LoginForm />
    </div>
  )
}