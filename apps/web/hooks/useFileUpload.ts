import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface UploadResponse {
  success: boolean
  data: { url: string; size: number; mimeType: string }
}

export function useFileUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await apiClient.post<UploadResponse>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    },
  })
}
