import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const { user, accessToken, logout } = useAuthStore()
  return {
    user,
    accessToken,
    logout,
    isAuthenticated: !!user && !!accessToken,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isModerator: user?.role === 'MODERATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
  }
}