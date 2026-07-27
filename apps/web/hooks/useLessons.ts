import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Lesson } from '@/lib/types/lesson'

export function useLessons(courseId: string | undefined) {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Lesson[] }>(`/lessons/course/${courseId}`)
      return data.data
    },
    enabled: !!courseId,
  })
}

export type LessonInput = {
  course:       string
  title:        string
  description?: string
  order?:       number
  durationMins?: number
  videoSource:  Lesson['videoSource']
  videoUrl:     string
  isPreview?:   boolean
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>, courseId: string) {
  queryClient.invalidateQueries({ queryKey: ['lessons', courseId] })
}

export function useCreateLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: LessonInput) => {
      const { data } = await apiClient.post<{ success: boolean; data: Lesson }>('/lessons', input)
      return data.data
    },
    onSuccess: () => invalidate(queryClient, courseId),
  })
}

export function useUpdateLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<LessonInput> }) => {
      const { data } = await apiClient.put<{ success: boolean; data: Lesson }>(`/lessons/${id}`, input)
      return data.data
    },
    onSuccess: () => invalidate(queryClient, courseId),
  })
}

export function useDeleteLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/lessons/${id}`),
    onSuccess: () => invalidate(queryClient, courseId),
  })
}
