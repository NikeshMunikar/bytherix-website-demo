import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Post } from '@/lib/types/post'
import type { PaginatedMeta } from '@/lib/types/course'

export function useAdminPosts(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'posts', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Post[]; meta: PaginatedMeta }>('/posts/admin/list', { params })
      return data
    },
  })
}

export function useAdminPost(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'post', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Post }>(`/posts/admin/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export type PostInput = {
  title:        string
  excerpt:      string
  content:      string
  coverImage:   string
  tags?:        string[]
  isPublished?: boolean
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] })
  queryClient.invalidateQueries({ queryKey: ['posts'] })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PostInput) => {
      const { data } = await apiClient.post<{ success: boolean; data: Post }>('/posts', input)
      return data.data
    },
    onSuccess: () => invalidate(queryClient),
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<PostInput> }) => {
      const { data } = await apiClient.put<{ success: boolean; data: Post }>(`/posts/${id}`, input)
      return data.data
    },
    onSuccess: () => invalidate(queryClient),
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/posts/${id}`),
    onSuccess: () => invalidate(queryClient),
  })
}
