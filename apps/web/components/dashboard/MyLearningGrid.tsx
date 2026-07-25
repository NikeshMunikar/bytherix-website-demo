'use client'
import Link from 'next/link'
import { BookOpen, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { useMyEnrollments } from '@/hooks/useEnrollments'

function CardSkeleton() {
  return (
    <div className="bx-card rounded-2xl p-5 flex gap-4 animate-pulse">
      <div className="w-20 h-20 rounded-xl bg-bx-border shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 bg-bx-border rounded" />
        <div className="h-3 w-1/3 bg-bx-border rounded" />
        <div className="h-1.5 w-full bg-bx-border rounded-full mt-3" />
      </div>
    </div>
  )
}

export function MyLearningGrid() {
  const { data: enrollments, isLoading, isError, refetch } = useMyEnrollments()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bx-card rounded-2xl p-10 text-center">
        <AlertTriangle className="w-8 h-8 text-bx-red mx-auto mb-3" />
        <p className="text-bx-white font-medium mb-1">Couldn&apos;t load your courses</p>
        <p className="text-bx-slate text-sm mb-4">Something went wrong. Please try again.</p>
        <button onClick={() => refetch()} className="px-4 py-2 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold transition-colors">
          Try again
        </button>
      </div>
    )
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="bx-card rounded-2xl p-10 text-center">
        <BookOpen className="w-8 h-8 text-bx-muted mx-auto mb-3" />
        <p className="text-bx-white font-medium mb-1">No courses yet</p>
        <p className="text-bx-slate text-sm mb-4">Enroll in a course to start tracking your progress here.</p>
        <Link href="/training" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold transition-colors">
          Browse courses <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {enrollments.map((e) => (
        <div key={e._id} className="bx-card rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="w-20 h-20 rounded-xl bg-bx-border shrink-0 overflow-hidden flex items-center justify-center">
            {e.course.thumbnail
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={e.course.thumbnail} alt={e.course.title} className="w-full h-full object-cover" />
              : <BookOpen className="w-6 h-6 text-bx-muted" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-bx-muted font-medium mb-0.5">{e.course.category}</p>
            <p className="text-bx-white font-semibold text-sm truncate mb-2">{e.course.title}</p>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1 text-xs text-bx-muted"><Clock className="w-3 h-3" /> {e.course.duration}h</span>
              {e.status === 'COMPLETED' && <span className="text-xs font-semibold text-bx-green-light">Completed</span>}
            </div>
            <div className="h-1.5 bg-bx-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-bx-blue transition-all duration-700" style={{ width: `${e.progress}%` }} />
            </div>
            <p className="text-xs text-bx-muted mt-1">{e.progress}% complete</p>
          </div>
          <Link href={`/training/${e.course.slug}`}
            className="shrink-0 px-4 py-2 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold text-center transition-colors">
            {e.status === 'COMPLETED' ? 'Review' : 'Resume'}
          </Link>
        </div>
      ))}
    </div>
  )
}
