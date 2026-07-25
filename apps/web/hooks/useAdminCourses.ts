import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Course, PaginatedMeta } from '@/lib/types/course'

export function useAdminCourses(params: { q?: string; category?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'courses', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Course[]; meta: PaginatedMeta }>('/courses/admin/list', { params })
      return data
    },
  })
}

export function useAdminCourse(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'course', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Course }>(`/courses/admin/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export type CourseInput = {
  title:         string
  description:   string
  thumbnail:     string
  category:      string
  price:         number
  originalPrice: number
  duration:      number
  level:         'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  tags?:         string[]
  badge?:        'BESTSELLER' | 'TOP_RATED' | 'POPULAR' | 'NEW' | ''
  isPublished?:  boolean
  isFeatured?:   boolean
}

function invalidateCourseQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
  queryClient.invalidateQueries({ queryKey: ['courses'] })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CourseInput) => {
      const { data } = await apiClient.post<{ success: boolean; data: Course }>('/courses', clean(input))
      return data.data
    },
    onSuccess: () => invalidateCourseQueries(queryClient),
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<CourseInput> }) => {
      const { data } = await apiClient.put<{ success: boolean; data: Course }>(`/courses/${id}`, clean(input))
      return data.data
    },
    onSuccess: () => invalidateCourseQueries(queryClient),
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/courses/${id}`),
    onSuccess: () => invalidateCourseQueries(queryClient),
  })
}

// Strips empty-string badge (form default) so it isn't sent as an invalid enum value
function clean<T extends Record<string, unknown>>(input: T): T {
  const copy = { ...input }
  if (copy.badge === '') delete copy.badge
  return copy
}
