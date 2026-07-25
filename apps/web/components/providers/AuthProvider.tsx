'use client'
import { useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, setInitialized } = useAuthStore()

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const { data } = await axios.post<{ data: { accessToken: string; user: Parameters<typeof setAuth>[0] } }>(
          `${BASE_URL}/auth/refresh`, {}, { withCredentials: true },
        )
        if (!cancelled) setAuth(data.data.user, data.data.accessToken)
      } catch {
        // No valid session — that's fine, user stays logged out
      } finally {
        if (!cancelled) setInitialized()
      }
    }

    bootstrap()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return children
}
