import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Enrollment } from '@/lib/types/enrollment'

interface EsewaFields {
  amount: string
  tax_amount: string
  total_amount: string
  transaction_uuid: string
  product_code: string
  product_service_charge: string
  product_delivery_charge: string
  success_url: string
  failure_url: string
  signed_field_names: string
  signature: string
}

type InitiateResult =
  | { free: true; enrollment: Enrollment }
  | { free: false; formUrl: string; fields: EsewaFields }

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await apiClient.post<{ success: boolean; data: InitiateResult }>('/payments/esewa/initiate', { courseId })
      return data.data
    },
  })
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (base64Data: string) => {
      const { data } = await apiClient.post<{ success: boolean; data: { enrollment: Enrollment } }>('/payments/esewa/verify', { data: base64Data })
      return data.data
    },
  })
}

// Auto-submits a real HTML form (not fetch) since eSewa needs a top-level
// browser navigation via POST to redirect the user to their login page.
export function submitToEsewa(formUrl: string, fields: EsewaFields): void {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = formUrl
  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = value
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
}
