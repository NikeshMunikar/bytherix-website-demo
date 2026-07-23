'use client'

const activities = [
  { action: 'Completed lesson',   detail: 'Linear Regression',   time: '2h ago',    dot: '#1452CC' },
  { action: 'Started course',     detail: 'Ethical Hacking',     time: 'Yesterday', dot: '#DC2626' },
  { action: 'Earned certificate', detail: 'Python Basics',       time: '3 days ago',dot: '#F59E0B' },
  { action: 'Quiz passed',        detail: 'Neural Networks 101', time: '5 days ago',dot: '#22C55E' },
]

export function RecentActivity() {
  return (
    <div className="bx-card p-6 rounded-2xl">
      <h2 className="text-bx-white font-semibold text-base mb-5">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: a.dot }} />
            <div className="flex-1 min-w-0">
              <p className="text-bx-white text-xs font-medium">{a.action}</p>
              <p className="text-bx-muted text-xs">{a.detail}</p>
            </div>
            <span className="text-bx-muted text-xs shrink-0">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}