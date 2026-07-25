import type { Metadata } from 'next'
import { CourseForm } from '@/components/admin/CourseForm'

export const metadata: Metadata = { title: 'New Course', robots: { index: false, follow: false } }

export default function NewCoursePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-bx-white">New course</h2>
      <CourseForm />
    </div>
  )
}
