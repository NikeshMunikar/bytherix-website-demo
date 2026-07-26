'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useVerifyPayment } from '@/hooks/usePayments'
import type { Enrollment } from '@/lib/types/enrollment'
import { isAxiosError } from 'axios'

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams()
  const data = searchParams.get('data')
  const verify = useVerifyPayment()
  const [state, setState] = useState<'verifying' | 'success' | 'error'>(data ? 'verifying' : 'error')
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [errorMessage, setErrorMessage] = useState(data ? '' : 'Missing payment confirmation data.')

  useEffect(() => {
    if (!data) return
    verify.mutate(data, {
      onSuccess: (result) => {
        setEnrollment(result.enrollment)
        setState('success')
      },
      onError: (err) => {
        const message = isAxiosError(err) ? err.response?.data?.error : undefined
        setErrorMessage(message ?? 'We could not verify your payment.')
        setState('error')
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (state === 'verifying') {
    return (
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-bx-blue animate-spin mx-auto mb-4" />
        <p className="text-bx-white font-medium">Verifying your payment...</p>
        <p className="text-bx-slate text-sm mt-1">This only takes a moment.</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="text-center">
        <XCircle className="w-10 h-10 text-bx-red mx-auto mb-4" />
        <p className="text-bx-white font-medium mb-2">Payment verification failed</p>
        <p className="text-bx-slate text-sm mb-6">{errorMessage}</p>
        <Link href="/training" className="text-bx-blue-light font-semibold text-sm hover:text-bx-blue">Back to courses</Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <CheckCircle2 className="w-10 h-10 text-bx-green-light mx-auto mb-4" />
      <p className="text-bx-white font-semibold text-lg mb-2">You&apos;re enrolled!</p>
      <p className="text-bx-slate text-sm mb-6">Your payment was successful. Time to start learning.</p>
      <Link href={enrollment ? `/training/${enrollment.course.slug}/learn` : '/my-learning'}
        className="inline-flex px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors">
        Start learning
      </Link>
    </div>
  )
}
