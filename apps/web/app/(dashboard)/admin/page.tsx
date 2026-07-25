'use client'
import { Users, BookOpen, GraduationCap, MailWarning, TrendingUp, UserPlus } from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdmin'
import { formatCurrency } from '@/lib/utils'

function cardsFor(stats: NonNullable<ReturnType<typeof useAdminStats>['data']>) {
  return {
    users:       { label: 'Total Users',        value: stats.totalUsers.toLocaleString(),                icon: Users,        sub: `+${stats.newUsersThisWeek} this week` },
    courses:     { label: 'Published Courses',  value: `${stats.publishedCourses} / ${stats.totalCourses}`, icon: BookOpen,   sub: 'published / total' },
    enrollments: { label: 'Active Enrollments', value: stats.activeEnrollments.toLocaleString(),          icon: GraduationCap, sub: `${stats.totalEnrollments} total` },
    revenue:     { label: 'Est. Revenue',       value: formatCurrency(stats.estimatedRevenue, 'NPR'),     icon: TrendingUp,   sub: 'from active enrollments' },
    messages:    { label: 'Unread Messages',    value: stats.unresolvedMessages.toLocaleString(),         icon: MailWarning,  sub: 'awaiting response' },
    newUsers:    { label: 'New Users',          value: stats.newUsersThisWeek.toLocaleString(),           icon: UserPlus,     sub: 'last 7 days' },
  }
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading, isError } = useAdminStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bx-card rounded-2xl p-5 animate-pulse h-24" />
        ))}
      </div>
    )
  }

  if (isError || !stats) {
    return <p className="text-bx-slate text-sm">Couldn&apos;t load stats. Please try again.</p>
  }

  const cards = Object.values(cardsFor(stats))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, sub }) => (
        <div key={label} className="bx-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-bx-muted text-xs font-medium">{label}</p>
            <div className="w-8 h-8 rounded-lg bg-bx-blue/15 flex items-center justify-center">
              <Icon className="w-4 h-4 text-bx-blue-light" />
            </div>
          </div>
          <p className="text-2xl font-bold text-bx-white mb-1">{value}</p>
          <p className="text-xs text-bx-muted">{sub}</p>
        </div>
      ))}
    </div>
  )
}
