import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { AdminStats, AdminUser, AuditLogEntry } from '@/lib/types/admin'
import type { PaginatedMeta } from '@/lib/types/course'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: AdminStats }>('/admin/stats')
      return data.data
    },
  })
}

export function useAdminUsers(params: { q?: string; role?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: AdminUser[]; meta: PaginatedMeta }>('/users', { params })
      return data
    },
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => apiClient.put(`/users/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
}

export function useAdminAuditLogs(params: { page?: number; limit?: number; action?: string }) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: AuditLogEntry[]; meta: PaginatedMeta }>('/admin/audit-logs', { params })
      return data
    },
  })
}
