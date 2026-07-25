'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Users, Clock, Bookmark, AlertTriangle, SearchX } from 'lucide-react'
import { useCourses } from '@/hooks/useCourses'
import { formatCurrency } from '@/lib/utils'
import type { CourseBadge } from '@/lib/types/course'

const BADGE_COLORS: Record<CourseBadge, string> = {
  BESTSELLER: '#F59E0B',
  TOP_RATED:  '#22C55E',
  POPULAR:    '#DC2626',
  NEW:        '#0EA5E9',
}

const BADGE_LABELS: Record<CourseBadge, string> = {
  BESTSELLER: 'Bestseller',
  TOP_RATED:  'Top Rated',
  POPULAR:    'Popular',
  NEW:        'New',
}

const GRADIENTS = [
  'from-blue-900 to-blue-700',
  'from-green-900 to-green-700',
  'from-red-900 to-red-700',
  'from-sky-900 to-sky-700',
  'from-cyan-900 to-cyan-700',
  'from-purple-900 to-purple-700',
]

function gradientFor(seed: string) {
  const idx = seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % GRADIENTS.length
  return GRADIENTS[idx]
}

type Props = { filters: { q?: string; category?: string; level?: string } }

function CourseCardSkeleton() {
  return (
    <div className="bx-card rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="h-40 bg-bx-border" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-bx-border rounded" />
        <div className="h-4 w-full bg-bx-border rounded" />
        <div className="h-4 w-2/3 bg-bx-border rounded" />
        <div className="h-3 w-1/2 bg-bx-border rounded" />
      </div>
    </div>
  )
}

export function CourseGrid({ filters }: Props) {
  const { data, isLoading, isError, refetch } = useCourses({
    q:        filters.q,
    category: filters.category,
    level:    filters.level as never,
    limit:    12,
  })

  if (isLoading) {
    return (
      <section className="py-12 bg-bx-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-40 bg-bx-border rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="py-20 bg-bx-navy">
        <div className="max-w-md mx-auto px-4 text-center">
          <AlertTriangle className="w-10 h-10 text-bx-red mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-bx-white mb-2">Couldn&apos;t load courses</h3>
          <p className="text-bx-slate text-sm mb-5">Something went wrong while fetching courses. Please try again.</p>
          <button onClick={() => refetch()}
            className="px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors">
            Try again
          </button>
        </div>
      </section>
    )
  }

  const courses = data?.data ?? []

  if (courses.length === 0) {
    return (
      <section className="py-20 bg-bx-navy">
        <div className="max-w-md mx-auto px-4 text-center">
          <SearchX className="w-10 h-10 text-bx-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-bx-white mb-2">No courses found</h3>
          <p className="text-bx-slate text-sm">Try adjusting your search or filters.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-bx-muted text-sm mb-6">{data?.meta.total ?? courses.length} courses found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c, i) => (
            <motion.article key={c._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group bx-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200">
              <Link href={`/training/${c.slug}`} className={`relative h-40 bg-gradient-to-br ${gradientFor(c.category)} flex items-center justify-center shrink-0 overflow-hidden`}>
                {c.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.thumbnail} alt={c.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                )}
                {c.badge && (
                  <span className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-md text-white z-10" style={{ background: BADGE_COLORS[c.badge] }}>
                    {BADGE_LABELS[c.badge]}
                  </span>
                )}
                <button className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-white/70 hover:text-white z-10" aria-label="Bookmark" onClick={(e) => e.preventDefault()}>
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-bx-muted mb-1 font-medium">{c.category}</p>
                <Link href={`/training/${c.slug}`}>
                  <h3 className="text-sm font-semibold text-bx-white leading-snug mb-3 line-clamp-2 hover:text-bx-blue-light transition-colors">{c.title}</h3>
                </Link>
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3 h-3" style={{ color: '#F59E0B', fill: j < Math.floor(c.rating) ? '#F59E0B' : 'none' }} />)}</div>
                  <span className="text-xs font-bold text-yellow-400">{c.rating.toFixed(1)}</span>
                  <span className="text-xs text-bx-muted">({c.reviewCount.toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 text-xs text-bx-muted"><Users className="w-3 h-3" /> {c.enrollmentCount.toLocaleString()}</span>
                  <span className="flex items-center gap-1 text-xs text-bx-muted"><Clock className="w-3 h-3" /> {c.duration}h</span>
                </div>
                <div className="mt-auto flex items-baseline gap-2">
                  <span className="text-base font-bold text-bx-white">{formatCurrency(c.price, c.currency)}</span>
                  {c.originalPrice > c.price && (
                    <>
                      <span className="text-xs text-bx-muted line-through">{formatCurrency(c.originalPrice, c.currency)}</span>
                      <span className="ml-auto text-xs font-bold text-bx-green-light">{Math.round((1 - c.price / c.originalPrice) * 100)}% off</span>
                    </>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
