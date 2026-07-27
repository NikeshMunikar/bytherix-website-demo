import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Enrollment } from '@/lib/types/enrollment'

interface EnrollmentsResponse {
  success: boolean
  data:    Enrollment[]
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<EnrollmentsResponse>('/enrollments/me')
      return data.data
    },
  })
}

export function useEnrollInCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await apiClient.post<{ success: boolean; data: Enrollment }>('/enrollments', { courseId })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] })
    },
  })
}

export function useUpdateEnrollmentProgress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, progress, completedLessons }: { id: string; progress?: number; completedLessons?: string[] }) => {
      const { data } = await apiClient.put<{ success: boolean; data: Enrollment }>(`/enrollments/${id}/progress`, { progress, completedLessons })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'me'] })
      queryClient.invalidateQueries({ queryKey: ['certificates', 'me'] })
    },
  })
}
