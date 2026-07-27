import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Course, CourseFilters, PaginatedMeta } from '@/lib/types/course'

interface CoursesResponse {
  success: boolean
  data:    Course[]
  meta:    PaginatedMeta
}

export function useCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const { data } = await apiClient.get<CoursesResponse>('/courses', { params: filters })
      return data
    },
  })
}

export function useCourse(slug: string | undefined) {
  return useQuery({
    queryKey: ['courses', 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Course }>(`/courses/${slug}`)
      return data.data
    },
    enabled: !!slug,
  })
}
