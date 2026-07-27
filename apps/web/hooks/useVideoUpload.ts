import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface UploadResponse {
  success: boolean
  data: { url: string; size: number; mimeType: string }
}

export function useVideoUpload(onProgress?: (percent: number) => void) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await apiClient.post<UploadResponse>('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      return data.data
    },
  })
}
