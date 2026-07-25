'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { AuthUser } from '@/store/auth.store'

type Props = { children: React.ReactNode; roles?: AuthUser['role'][] }

export function RequireAuth({ children, roles }: Props) {
  const { user, isAuthenticated, isInitialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const authorized = isAuthenticated && (!roles || (user && roles.includes(user.role)))

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isInitialized, isAuthenticated, pathname, router])

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-bx-blue animate-spin" />
      </div>
    )
  }

  if (roles && !authorized) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <ShieldAlert className="w-8 h-8 text-bx-red mb-3" />
        <p className="text-bx-white font-semibold mb-1">You don&apos;t have access to this page</p>
        <p className="text-bx-slate text-sm">This area is restricted to administrators.</p>
      </div>
    )
  }

  return children
}
