import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Post, PostFilters } from '@/lib/types/post'
import type { PaginatedMeta } from '@/lib/types/course'

interface PostsResponse {
  success: boolean
  data:    Post[]
  meta:    PaginatedMeta
}

export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const { data } = await apiClient.get<PostsResponse>('/posts', { params: filters })
      return data
    },
  })
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['posts', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Post }>(`/posts/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}
