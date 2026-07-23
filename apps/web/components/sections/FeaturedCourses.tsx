'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, Users, Clock, ArrowRight, Bookmark } from 'lucide-react'

const courses = [
  {
    badge: 'Bestseller', badgeColor: '#F59E0B',
    category: 'AI & Machine Learning',
    title: 'Machine Learning A–Z: Hands-On Python',
    rating: 4.8, reviews: 12450, students: '18.2k', duration: '42h',
    price: 499, original: 1999,
    bg: 'linear-gradient(135deg, #1e3a5f, #1452CC)', emoji: '🧠',
  },
  {
    badge: 'Top Rated', badgeColor: '#22C55E',
    category: 'Robotics & Automation',
    title: 'Robotics Process Automation (RPA) Bootcamp',
    rating: 4.7, reviews: 8230, students: '9.4k', duration: '28h',
    price: 399, original: 1599,
    bg: 'linear-gradient(135deg, #14532d, #16A34A)', emoji: '🤖',
  },
  {
    badge: 'Popular', badgeColor: '#DC2626',
    category: 'Cyber Security',
    title: 'Ethical Hacking & Penetration Testing Bootcamp',
    rating: 4.6, reviews: 9876, students: '14.1k', duration: '38h',
    price: 599, original: 2499,
    bg: 'linear-gradient(135deg, #450a0a, #DC2626)', emoji: '🔐',
  },
  {
    badge: 'New', badgeColor: '#0EA5E9',
    category: 'Web Development',
    title: 'Full Stack Web Development Bootcamp 2025',
    rating: 4.7, reviews: 7654, students: '11.3k', duration: '52h',
    price: 499, original: 1999,
    bg: 'linear-gradient(135deg, #0c4a6e, #0EA5E9)', emoji: '</>',
  },
]

export function FeaturedCourses() {
  return (
    <section className="py-24 relative" aria-labelledby="courses-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: '#1452CC' }}
            >
              Featured Courses
            </motion.p>
            <motion.h2
              id="courses-heading"
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]"
            >
              Hand-Picked for You
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link
              href="/training"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: '#1452CC' }}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="group card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative h-40 flex items-center justify-center shrink-0" style={{ background: c.bg }}>
                <span className="text-5xl">{c.emoji}</span>
                <span
                  className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-md text-white"
                  style={{ background: c.badgeColor }}
                >
                  {c.badge}
                </span>
                <button
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)' }}
                  aria-label={`Bookmark ${c.title}`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs font-medium mb-1 text-[var(--text-secondary)]">{c.category}</p>
                <h3 className="text-sm font-semibold leading-snug mb-3 line-clamp-2 text-[var(--text-primary)]">{c.title}</h3>

                {/* Stars */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-3 h-3" style={{ color: '#F59E0B', fill: j < Math.floor(c.rating) ? '#F59E0B' : 'none' }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>{c.rating}</span>
                  <span className="text-xs text-[var(--text-secondary)]">({c.reviews.toLocaleString()})</span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                    <Users className="w-3 h-3" /> {c.students}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                    <Clock className="w-3 h-3" /> {c.duration}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-auto flex items-baseline gap-2">
                  <span className="text-base font-bold text-[var(--text-primary)]">Rs. {c.price}</span>
                  <span className="text-xs line-through text-[var(--text-secondary)]">Rs. {c.original}</span>
                  <span className="ml-auto text-xs font-bold" style={{ color: '#22C55E' }}>
                    {Math.round((1 - c.price / c.original) * 100)}% off
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold text-sm"
            style={{ borderColor: 'rgba(20,82,204,0.4)', color: '#1452CC' }}
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}