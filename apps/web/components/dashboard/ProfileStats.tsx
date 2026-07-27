'use client'
import { BookOpen, Award, GraduationCap } from 'lucide-react'
import { useMyEnrollments } from '@/hooks/useEnrollments'
import { useMyCertificates } from '@/hooks/useCertificates'

export function ProfileStats() {
  const { data: enrollments, isLoading: enrollmentsLoading } = useMyEnrollments()
  const { data: certificates, isLoading: certificatesLoading } = useMyCertificates()

  const completed = enrollments?.filter((e) => e.status === 'COMPLETED').length ?? 0
  const isLoading = enrollmentsLoading || certificatesLoading

  const stats = [
    { icon: BookOpen,       label: 'Enrolled Courses', value: enrollments?.length ?? 0 },
    { icon: GraduationCap,  label: 'Completed',        value: completed },
    { icon: Award,          label: 'Certificates',     value: certificates?.length ?? 0 },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bx-card rounded-2xl p-4 text-center">
          <div className="w-9 h-9 rounded-xl bg-bx-blue/15 flex items-center justify-center mx-auto mb-2">
            <Icon className="w-4 h-4 text-bx-blue-light" />
          </div>
          {isLoading ? (
            <div className="h-6 w-8 bg-bx-border rounded mx-auto animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-bx-white">{value}</p>
          )}
          <p className="text-xs text-bx-muted mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
