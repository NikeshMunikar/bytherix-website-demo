import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Create Account', robots: { index: false, follow: false } }

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-bx-white mb-2">Create your account</h1>
        <p className="text-bx-slate text-sm">Join 500+ students building real skills</p>
      </div>
      <RegisterForm />
    </div>
  )
}