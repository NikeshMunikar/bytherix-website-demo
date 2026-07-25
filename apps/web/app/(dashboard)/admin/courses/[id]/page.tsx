'use client'
import { use } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useAdminCourse } from '@/hooks/useAdminCourses'
import { CourseForm } from '@/components/admin/CourseForm'

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: course, isLoading, isError } = useAdminCourse(id)

  if (isLoading) {
    return <div className="bx-card rounded-2xl p-6 max-w-2xl h-96 animate-pulse" />
  }

  if (isError || !course) {
    return (
      <div className="bx-card rounded-2xl p-10 text-center max-w-2xl">
        <AlertTriangle className="w-6 h-6 text-bx-red mx-auto mb-2" />
        <p className="text-bx-slate text-sm">Couldn&apos;t load this course.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-bx-white">Edit course</h2>
      <CourseForm course={course} />
    </div>
  )
}
