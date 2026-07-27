import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { CheckoutSuccessClient } from '@/components/checkout/CheckoutSuccessClient'

export const metadata: Metadata = { title: 'Payment Successful', robots: { index: false, follow: false } }

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20 px-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 text-bx-blue animate-spin" />}>
        <CheckoutSuccessClient />
      </Suspense>
    </div>
  )
}
