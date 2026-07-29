'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BookOpen, Briefcase } from 'lucide-react'

export function CTA() {
  return (
<<<<<<< HEAD
    <section className="py-24 relative overflow-hidden" aria-label="Call to action" style={{ backgroundColor: 'var(--bg-surface)' }}>
=======
    <section className="py-24 relative overflow-hidden border-t border-[#1E2D4A]" aria-label="Call to action">
>>>>>>> af142b9d2c2736c934f34a0bf6f848ee0e41db28
      {/* Glow */}
      <div
<<<<<<< HEAD
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,80vw)] h-[min(400px,50vh)] rounded-full pointer-events-none"
=======
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[37.5rem] h-[25rem] rounded-full pointer-events-none"
>>>>>>> d9a2372529a118fcd0093fa92b6bb93360b3ceda
        style={{ background: 'rgba(20,82,204,0.08)', filter: 'blur(80px)' }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bx-border to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-4"
          style={{ color: '#1452CC' }}
        >
          Ready to Start?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
          className="text-3xl sm:text-5xl font-black leading-tight mb-5 text-[var(--text-primary)]"
        >
          Your tech journey starts{' '}
          <span className="text-gradient-blue">today.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-lg mb-10 max-w-xl mx-auto text-[var(--text-secondary)]"
        >
          Whether you want to learn new skills or build your next product — Bytherix
          has the courses, mentors, and services to get you there.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/training"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: '#1452CC', boxShadow: '0 8px 32px rgba(20,82,204,0.25)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#2D6EEF' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1452CC' }}
          >
            <BookOpen className="w-5 h-5" />
            Explore Courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{ border: '1px solid #1E2D4A', color: '#8B9DC3' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'rgba(20,82,204,0.4)'
              el.style.color = '#F8FAFF'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = '#1E2D4A'
              el.style.color = '#8B9DC3'
            }}
          >
            <Briefcase className="w-5 h-5" />
            Hire Our Team
          </Link>
        </motion.div>
      </div>
    </section>
  )
}