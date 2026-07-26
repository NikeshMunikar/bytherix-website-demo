'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Lock, PlayCircle, CheckCircle2, Circle, AlertTriangle, Loader2 } from 'lucide-react'
import { useCourse } from '@/hooks/useCourses'
import { useLessons } from '@/hooks/useLessons'
import { useMyEnrollments, useUpdateEnrollmentProgress } from '@/hooks/useEnrollments'
import { VideoPlayer } from '@/components/lessons/VideoPlayer'

export function LessonPlayer({ slug }: { slug: string }) {
  const { data: course, isLoading: courseLoading } = useCourse(slug)
  const { data: lessons, isLoading: lessonsLoading } = useLessons(course?._id)
  const { data: enrollments } = useMyEnrollments()
  const updateProgress = useUpdateEnrollmentProgress()

  const enrollment = enrollments?.find((e) => e.course.slug === slug)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sorted = useMemo(() => [...(lessons ?? [])].sort((a, b) => a.order - b.order), [lessons])

  if (courseLoading || lessonsLoading) {
    return <div className="pt-28 pb-20 max-w-7xl mx-auto px-4"><div className="h-96 bg-bx-border rounded-2xl animate-pulse" /></div>
  }

  if (!course || !sorted.length) {
    return (
      <div className="pt-28 pb-20 text-center">
        <AlertTriangle className="w-8 h-8 text-bx-red mx-auto mb-3" />
        <p className="text-bx-white font-medium">This course doesn&apos;t have any lessons yet.</p>
      </div>
    )
  }

  const active = sorted.find((l) => l._id === activeId) ?? sorted[0]!

  const isCompleted = (lessonId: string) => enrollment?.completedLessons.includes(lessonId) ?? false

  const handleMarkComplete = () => {
    if (!enrollment || !active) return
    const already = isCompleted(active._id)
    const nextCompleted = already
      ? enrollment.completedLessons
      : [...enrollment.completedLessons, active._id]
    const progress = Math.round((nextCompleted.length / sorted.length) * 100)

    updateProgress.mutate({ id: enrollment._id, progress, completedLessons: nextCompleted }, {
      onSuccess: () => toast.success(progress >= 100 ? 'Course completed! 🎉' : 'Marked as complete'),
      onError:   () => toast.error('Could not update progress'),
    })
  }

  return (
    <div className="pt-24 pb-16 bg-bx-navy min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/training/${slug}`} className="text-sm text-bx-slate hover:text-bx-white transition-colors">&larr; {course.title}</Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              {active.locked ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                  <Lock className="w-8 h-8 text-bx-muted mb-3" />
                  <p className="text-bx-white font-medium mb-1">This lesson is locked</p>
                  <p className="text-bx-slate text-sm mb-4">Enroll in this course to unlock all lessons.</p>
                  <Link href={`/training/${slug}`} className="px-4 py-2 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold transition-colors">
                    View course
                  </Link>
                </div>
              ) : (
                <VideoPlayer source={active.videoSource} url={active.videoUrl!} />
              )}
            </div>

            <div className="bx-card rounded-2xl p-5">
              <h1 className="text-xl font-semibold text-bx-white mb-2">{active.title}</h1>
              {active.description && <p className="text-bx-slate text-sm mb-4">{active.description}</p>}
              {enrollment && !active.locked && (
                <button onClick={handleMarkComplete} disabled={updateProgress.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold transition-colors disabled:opacity-50">
                  {updateProgress.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {isCompleted(active._id) ? 'Completed' : 'Mark as complete'}
                </button>
              )}
            </div>
          </div>

          <div className="bx-card rounded-2xl overflow-hidden h-fit">
            <p className="px-4 py-3 text-sm font-semibold text-bx-white border-b border-bx-border">
              Course content {enrollment && `· ${enrollment.progress}% complete`}
            </p>
            <div className="divide-y divide-bx-border max-h-[32rem] overflow-y-auto">
              {sorted.map((lesson) => (
                <button key={lesson._id} onClick={() => setActiveId(lesson._id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${lesson._id === active._id ? 'bg-bx-blue/10' : 'hover:bg-bx-navy'}`}>
                  {lesson.locked
                    ? <Lock className="w-4 h-4 text-bx-muted shrink-0" />
                    : isCompleted(lesson._id)
                      ? <CheckCircle2 className="w-4 h-4 text-bx-green-light shrink-0" />
                      : lesson._id === active._id
                        ? <PlayCircle className="w-4 h-4 text-bx-blue-light shrink-0" />
                        : <Circle className="w-4 h-4 text-bx-muted shrink-0" />}
                  <span className={`text-sm flex-1 truncate ${lesson._id === active._id ? 'text-bx-white font-medium' : 'text-bx-slate'}`}>{lesson.title}</span>
                  <span className="text-xs text-bx-muted shrink-0">{lesson.durationMins}m</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
