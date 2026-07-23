'use client'

const courses = [
  { title: 'Machine Learning A–Z',       progress: 68, category: 'AI & ML',  color: '#1452CC' },
  { title: 'Ethical Hacking Bootcamp',   progress: 32, category: 'Security', color: '#DC2626' },
  { title: 'Full Stack Web Development', progress: 15, category: 'Web Dev',  color: '#22C55E' },
]

export function ContinueLearning() {
  return (
    <div className="bx-card p-6 rounded-2xl">
      <h2 className="text-bx-white font-semibold text-base mb-5">Continue Learning</h2>
      <div className="space-y-4">
        {courses.map((c) => (
          <div key={c.title}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-bx-white text-sm font-medium">{c.title}</p>
                <p className="text-bx-muted text-xs">{c.category}</p>
              </div>
              <span className="text-xs font-semibold" style={{ color: c.color }}>{c.progress}%</span>
            </div>
            <div className="h-1.5 bg-bx-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.progress}%`, background: c.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}