'use client'
import { Clock, Users, Star, BookOpen, Shield } from 'lucide-react'

export function CourseDetail({ slug }: { slug: string }) {
  const title = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return (
    <div className="pt-28 pb-20 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <p className="text-xs font-mono text-bx-blue uppercase tracking-wider mb-3">Course</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-bx-white mb-4">{title}</h1>
            <p className="text-bx-slate mb-6">Master {title} with hands-on projects, real-world examples, and expert instruction from industry professionals.</p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[{ icon: Star, val: '4.8 Rating' }, { icon: Users, val: '12,450 Students' }, { icon: Clock, val: '42 Hours' }, { icon: BookOpen, val: '120 Lessons' }].map(({ icon: Icon, val }) => (
                <span key={val} className="flex items-center gap-1.5 text-sm text-bx-slate"><Icon className="w-4 h-4 text-bx-blue" /> {val}</span>
              ))}
            </div>
          </div>
          <div className="bx-card p-6 rounded-2xl h-fit sticky top-20">
            <div className="text-3xl font-bold text-bx-white mb-1">₹499</div>
            <div className="text-bx-muted text-sm line-through mb-4">₹1,999</div>
            <button className="w-full py-3 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-bold transition-colors mb-3">Enroll Now</button>
            <button className="w-full py-3 rounded-xl border border-bx-border text-bx-slate hover:text-bx-white hover:border-bx-blue/40 font-semibold text-sm transition-colors">Try Free Preview</button>
            <div className="mt-4 flex items-center gap-2 text-xs text-bx-muted">
              <Shield className="w-4 h-4 text-bx-green" /> 30-day money-back guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}