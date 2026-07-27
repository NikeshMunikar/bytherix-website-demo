'use client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Clock, Users, Star, BookOpen, Shield, Lock, PlayCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { useCourse } from '@/hooks/useCourses'
import { useLessons } from '@/hooks/useLessons'
import { useMyEnrollments } from '@/hooks/useEnrollments'
import { useInitiatePayment, submitToEsewa } from '@/hooks/usePayments'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'

export function CourseDetail({ slug }: { slug: string }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data: course, isLoading, isError } = useCourse(slug)
  const { data: lessons } = useLessons(course?._id)
  const { data: enrollments } = useMyEnrollments()
  const initiate = useInitiatePayment()

  const enrollment = enrollments?.find((e) => e.course.slug === slug)

  const handleEnroll = async () => {
    if (!course) return
    if (!isAuthenticated) {
      router.push(`/login?redirect=/training/${slug}`)
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
    return <div className="pt-28 pb-20 bg-bx-navy"><div className="max-w-7xl mx-auto px-4 h-64 animate-pulse bg-bx-border rounded-2xl" /></div>
  }

  if (isError || !course) {
    return (
      <div className="pt-28 pb-20 bg-bx-navy text-center">
        <AlertTriangle className="w-8 h-8 text-bx-red mx-auto mb-3" />
        <p className="text-bx-white font-medium">Couldn&apos;t load this course.</p>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-20 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <p className="text-xs font-mono text-bx-blue uppercase tracking-wider mb-3">{course.category}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-bx-white mb-4">{course.title}</h1>
            <p className="text-bx-slate mb-6">{course.description}</p>
            <div className="flex flex-wrap gap-4 mb-10">
              <span className="flex items-center gap-1.5 text-sm text-bx-slate"><Star className="w-4 h-4 text-bx-blue" /> {course.rating.toFixed(1)} Rating</span>
              <span className="flex items-center gap-1.5 text-sm text-bx-slate"><Users className="w-4 h-4 text-bx-blue" /> {course.enrollmentCount.toLocaleString()} Students</span>
              <span className="flex items-center gap-1.5 text-sm text-bx-slate"><Clock className="w-4 h-4 text-bx-blue" /> {course.duration} Hours</span>
              <span className="flex items-center gap-1.5 text-sm text-bx-slate"><BookOpen className="w-4 h-4 text-bx-blue" /> {lessons?.length ?? 0} Lessons</span>
            </div>

            {lessons && lessons.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-bx-white mb-4">Course content</h2>
                <div className="bx-card rounded-2xl divide-y divide-bx-border overflow-hidden">
                  {lessons.map((lesson) => (
                    <div key={lesson._id} className="flex items-center gap-3 px-4 py-3">
                      {lesson.locked ? <Lock className="w-4 h-4 text-bx-muted shrink-0" /> : <PlayCircle className="w-4 h-4 text-bx-blue-light shrink-0" />}
                      <span className="text-sm text-bx-white flex-1 truncate">{lesson.title}</span>
                      {lesson.isPreview && <span className="text-xs font-semibold text-bx-green-light">Preview</span>}
                      <span className="text-xs text-bx-muted shrink-0">{lesson.durationMins} min</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bx-card p-6 rounded-2xl h-fit sticky top-20">
            <div className="text-3xl font-bold text-bx-white mb-1">{course.price > 0 ? formatCurrency(course.price, course.currency) : 'Free'}</div>
            {course.originalPrice > course.price && (
              <div className="text-bx-muted text-sm line-through mb-4">{formatCurrency(course.originalPrice, course.currency)}</div>
            )}

            {enrollment ? (
              <button onClick={() => router.push(`/training/${slug}/learn`)}
                className="w-full py-3 rounded-xl bg-bx-green hover:bg-bx-green-light text-white font-bold transition-colors mb-3">
                Continue Learning
              </button>
            ) : (
              <button onClick={handleEnroll} disabled={initiate.isPending}
                className="w-full py-3 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-bold transition-colors mb-3 disabled:opacity-50 flex items-center justify-center gap-2">
                {initiate.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {course.price > 0 ? 'Enroll Now' : 'Enroll for Free'}
              </button>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-bx-muted">
              <Shield className="w-4 h-4 text-bx-green" /> Secure checkout via eSewa
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
