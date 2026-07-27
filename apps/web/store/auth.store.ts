import { create } from 'zustand'

export interface AuthUser {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
  avatar?: string
  isEmailVerified: boolean
  emailNotifications?: boolean
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isInitialized: boolean
  setAuth: (user: AuthUser, accessToken: string) => void
  setAccessToken: (token: string) => void
  setUser: (user: Partial<AuthUser>) => void
  setInitialized: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  isInitialized: false,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (patch) => set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
  setInitialized: () => set({ isInitialized: true }),
  logout: () => set({ user: null, accessToken: null }),
}))