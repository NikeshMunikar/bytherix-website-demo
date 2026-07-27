'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export function CheckoutFailureClient() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const transactionUuid = searchParams.get('transactionUuid')
    if (transactionUuid) {
      apiClient.post('/payments/esewa/mark-failed', { transactionUuid }).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="text-center">
      <XCircle className="w-10 h-10 text-bx-red mx-auto mb-4" />
      <p className="text-bx-white font-semibold text-lg mb-2">Payment not completed</p>
      <p className="text-bx-slate text-sm mb-6">Your payment was cancelled or didn&apos;t go through. You haven&apos;t been charged.</p>
      <Link href="/training" className="inline-flex px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors">
        Back to courses
      </Link>
    </div>
  )
}
