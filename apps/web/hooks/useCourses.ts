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
