'use client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Clock, Users, Shield, Loader2, AlertTriangle } from 'lucide-react'
import { useCourse } from '@/hooks/useCourses'
import { useMyEnrollments } from '@/hooks/useEnrollments'
import { useInitiatePayment, submitToEsewa } from '@/hooks/usePayments'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'

export function CheckoutSummary({ slug }: { slug: string }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data: course, isLoading, isError } = useCourse(slug)
  const { data: enrollments } = useMyEnrollments()
  const initiate = useInitiatePayment()

  const alreadyEnrolled = enrollments?.some((e) => e.course.slug === slug)

  const handleConfirm = async () => {
    if (!course) return
    if (!isAuthenticated) {
      router.push(`/login?redirect=/checkout/${slug}`)
      return
    }
    try {
      const result = await initiate.mutateAsync(course._id)
      if (result.free) {
        toast.success('Enrolled! Let\'s get started.')
        router.push(`/training/${slug}/learn`)
      } else {
        submitToEsewa(result.formUrl, result.fields)
      }
    } catch {
      toast.error('Could not start checkout. Please try again.')
    }
  }

  if (isLoading) {
    return <div className="max-w-lg mx-auto h-64 bg-bx-border rounded-2xl animate-pulse" />
  }

  if (isError || !course) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <AlertTriangle className="w-8 h-8 text-bx-red mx-auto mb-3" />
        <p className="text-bx-white font-medium">Couldn&apos;t load this course.</p>
      </div>
    )
  }

  if (alreadyEnrolled) {
    return (
      <div className="max-w-lg mx-auto bx-card rounded-2xl p-8 text-center">
        <p className="text-bx-white font-semibold text-lg mb-2">You&apos;re already enrolled</p>
        <p className="text-bx-slate text-sm mb-6">No need to pay again — jump right back in.</p>
        <button onClick={() => router.push(`/training/${slug}/learn`)}
          className="px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors">
          Continue Learning
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="bx-card rounded-2xl p-6">
        <p className="text-xs text-bx-muted font-medium mb-1">{course.category}</p>
        <h1 className="text-xl font-bold text-bx-white mb-4">{course.title}</h1>
        <div className="flex items-center gap-4 text-sm text-bx-muted mb-6">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}h</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.enrollmentCount.toLocaleString()} enrolled</span>
        </div>

        <div className="border-t border-bx-border pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-bx-slate">Course price</span>
            <span className="text-bx-white">{course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}</span>
          </div>
          {course.originalPrice > course.price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-bx-slate">Discount</span>
              <span className="text-bx-green-light">-{formatCurrency(course.originalPrice - course.price, course.currency)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-bx-border">
            <span className="text-bx-white">Total</span>
            <span className="text-bx-white">{course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}</span>
          </div>
        </div>
      </div>

      <button onClick={handleConfirm} disabled={initiate.isPending}
        className="w-full py-3 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {initiate.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {course.price > 0 ? 'Pay with eSewa' : 'Confirm Free Enrollment'}
      </button>

      <p className="flex items-center justify-center gap-2 text-xs text-bx-muted">
        <Shield className="w-3.5 h-3.5 text-bx-green" /> Payments are processed securely by eSewa
      </p>
    </div>
  )
}
