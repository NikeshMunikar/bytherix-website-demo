'use client'
import { BookOpen, Clock, Trophy, Flame } from 'lucide-react'

const stats = [
  { icon: BookOpen, label: 'Courses Enrolled', value: '4',   color: '#1452CC', dim: 'rgba(20,82,204,0.1)' },
  { icon: Clock,    label: 'Hours Learned',    value: '28h', color: '#22C55E', dim: 'rgba(34,197,94,0.1)' },
  { icon: Trophy,   label: 'Certificates',     value: '1',   color: '#F59E0B', dim: 'rgba(245,158,11,0.1)' },
  { icon: Flame,    label: 'Day Streak',        value: '7',   color: '#DC2626', dim: 'rgba(220,38,38,0.1)' },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div key={s.label} className="bx-card p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: s.dim }}>
              <Icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-bx-muted text-xs">{s.label}</p>
          </div>
        )
      })}
    </div>
  )
}