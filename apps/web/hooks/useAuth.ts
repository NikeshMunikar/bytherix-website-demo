import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const { user, accessToken, isInitialized, logout } = useAuthStore()
  return {
    user,
    accessToken,
    isInitialized,
    logout,
    isAuthenticated: !!user && !!accessToken,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isModerator: user?.role === 'MODERATOR' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
  }
}