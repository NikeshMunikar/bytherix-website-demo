import { create } from 'zustand'

export interface AuthUser {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN'
  avatar?: string
  isEmailVerified: boolean
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  setAuth: (user: AuthUser, accessToken: string) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null }),
}))