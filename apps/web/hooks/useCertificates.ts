import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Certificate } from '@/lib/types/certificate'

export function useMyCertificates() {
  return useQuery({
    queryKey: ['certificates', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Certificate[] }>('/certificates/me')
      return data.data
    },
  })
}

// Certificate downloads require the Bearer token, so a plain <a href> won't
// carry auth — fetch as a blob and trigger the save via an object URL instead.
export async function downloadCertificate(id: string, filename: string): Promise<void> {
  const res = await apiClient.get(`/certificates/${id}/download`, { responseType: 'blob' })
  const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
