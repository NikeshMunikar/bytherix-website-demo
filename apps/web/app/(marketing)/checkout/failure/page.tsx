import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CheckoutFailureClient } from '@/components/checkout/CheckoutFailureClient'

export const metadata: Metadata = { title: 'Payment Failed', robots: { index: false, follow: false } }

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20 px-4">
      <Suspense fallback={null}>
        <CheckoutFailureClient />
      </Suspense>
    </div>
  )
}
