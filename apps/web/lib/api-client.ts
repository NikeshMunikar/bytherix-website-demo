import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { useAuthStore } from '@/store/auth.store'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = []

function flush(err: unknown, token: string | null) {
  queue.forEach(({ resolve, reject }) => token ? resolve(token) : reject(err))
  queue = []
}

apiClient.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const orig = error.config as typeof error.config & { _retry?: boolean }
    if (error.response?.status !== 401 || orig?._retry) return Promise.reject(error)

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then((token) => {
        orig!.headers!['Authorization'] = `Bearer ${token}`
        return apiClient(orig!)
      })
    }

    orig!._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post<{ data: { accessToken: string } }>(
        `${BASE_URL}/auth/refresh`, {}, { withCredentials: true }
      )
      const token = data.data.accessToken
      useAuthStore.getState().setAccessToken(token)
      flush(null, token)
      orig!.headers!['Authorization'] = `Bearer ${token}`
      return apiClient(orig!)
    } catch (e) {
      flush(e, null)
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined') window.location.href = '/login'
      return Promise.reject(e)
    } finally {
      isRefreshing = false
    }
  }
)