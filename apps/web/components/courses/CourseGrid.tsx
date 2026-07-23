'use client'
import { motion } from 'framer-motion'
import { Star, Users, Clock, Bookmark } from 'lucide-react'

const courses = [
  { badge: 'Bestseller', badgeColor: '#F59E0B', category: 'AI & ML',      title: 'Machine Learning A–Z: Hands-On Python',           rating: 4.8, reviews: 12450, students: '18.2k', duration: '42h', price: 499,  original: 1999, bg: 'from-blue-900 to-blue-700',   emoji: '🧠' },
  { badge: 'Top Rated',  badgeColor: '#22C55E', category: 'Robotics',      title: 'Robotics Process Automation (RPA) Bootcamp',       rating: 4.7, reviews: 8230,  students: '9.4k',  duration: '28h', price: 399,  original: 1599, bg: 'from-green-900 to-green-700', emoji: '🤖' },
  { badge: 'Popular',    badgeColor: '#DC2626', category: 'Cyber Security', title: 'Ethical Hacking & Penetration Testing Bootcamp',   rating: 4.6, reviews: 9876,  students: '14.1k', duration: '38h', price: 599,  original: 2499, bg: 'from-red-900 to-red-700',     emoji: '🔐' },
  { badge: 'New',        badgeColor: '#0EA5E9', category: 'Web Dev',        title: 'Full Stack Web Development Bootcamp 2025',         rating: 4.7, reviews: 7654,  students: '11.3k', duration: '52h', price: 499,  original: 1999, bg: 'from-sky-900 to-sky-700',     emoji: '</>'},
  { badge: 'Bestseller', badgeColor: '#F59E0B', category: 'App Dev',        title: 'Flutter & Dart — Complete Mobile App Development', rating: 4.8, reviews: 6120,  students: '8.9k',  duration: '36h', price: 449,  original: 1799, bg: 'from-cyan-900 to-cyan-700',   emoji: '📱' },
  { badge: 'Popular',    badgeColor: '#DC2626', category: 'Game Dev',       title: 'Unity 3D Game Development Masterclass',            rating: 4.5, reviews: 5430,  students: '7.2k',  duration: '44h', price: 549,  original: 2199, bg: 'from-purple-900 to-purple-700',emoji: '🎮' },
]

type Props = { filters: { q?: string; category?: string; level?: string } }

export function CourseGrid({ filters }: Props) {
  const filtered = courses.filter((c) => {
    if (filters.q && !c.title.toLowerCase().includes(filters.q.toLowerCase())) return false
    if (filters.category && !c.category.toLowerCase().includes(filters.category.toLowerCase())) return false
    return true
  })

  return (
    <section className="py-12 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-bx-muted text-sm mb-6">{filtered.length} courses found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <motion.article key={c.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group bx-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200">
              <div className={`relative h-40 bg-gradient-to-br ${c.bg} flex items-center justify-center shrink-0`}>
                <span className="text-5xl">{c.emoji}</span>
                <span className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-md text-white" style={{ background: c.badgeColor }}>{c.badge}</span>
                <button className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-white/70 hover:text-white" aria-label="Bookmark">
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-bx-muted mb-1 font-medium">{c.category}</p>
                <h3 className="text-sm font-semibold text-bx-white leading-snug mb-3 line-clamp-2">{c.title}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3 h-3" style={{ color: '#F59E0B', fill: j < Math.floor(c.rating) ? '#F59E0B' : 'none' }} />)}</div>
                  <span className="text-xs font-bold text-yellow-400">{c.rating}</span>
                  <span className="text-xs text-bx-muted">({c.reviews.toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 text-xs text-bx-muted"><Users className="w-3 h-3" /> {c.students}</span>
                  <span className="flex items-center gap-1 text-xs text-bx-muted"><Clock className="w-3 h-3" /> {c.duration}</span>
                </div>
                <div className="mt-auto flex items-baseline gap-2">
                  <span className="text-base font-bold text-bx-white">₹{c.price}</span>
                  <span className="text-xs text-bx-muted line-through">₹{c.original}</span>
                  <span className="ml-auto text-xs font-bold text-bx-green-light">{Math.round((1 - c.price / c.original) * 100)}% off</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}