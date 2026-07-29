'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, ArrowRight } from 'lucide-react'

const projects = [
  { title: 'E-Commerce Platform',        category: 'Web Development',  color: '#1452CC', emoji: '🛒', bg: 'linear-gradient(135deg, #0a1f4e, #1452CC)', desc: 'Full-featured store with Stripe payments and admin dashboard.' },
  { title: 'School Management System',   category: 'Web Development',  color: '#16A34A', emoji: '🏫', bg: 'linear-gradient(135deg, #052e16, #16A34A)', desc: 'Multi-role SaaS for schools — attendance, grades, timetables.' },
  { title: 'Mobile Banking App',         category: 'App Development',  color: '#0EA5E9', emoji: '💳', bg: 'linear-gradient(135deg, #0c2d48, #0EA5E9)', desc: 'Secure fintech app with biometric auth and real-time transactions.' },
  { title: 'Security Audit Report Tool', category: 'Security Testing', color: '#DC2626', emoji: '🛡️', bg: 'linear-gradient(135deg, #3b0404, #DC2626)', desc: 'Automated VAPT reporting with 16-phase assessment pipeline.' },
  { title: 'AI Chatbot Assistant',       category: 'AI & Automation',  color: '#F59E0B', emoji: '🤖', bg: 'linear-gradient(135deg, #431407, #F59E0B)', desc: 'RAG-powered customer service bot with multi-language support.' },
  { title: 'Multiplayer Game Prototype', category: 'Game Development', color: '#9333EA', emoji: '🎮', bg: 'linear-gradient(135deg, #2e1065, #9333EA)', desc: 'Real-time multiplayer arena built with Unity and Photon.' },
]

export function RecentProjects() {
  return (
<<<<<<< HEAD
    <section className="py-24 relative" aria-labelledby="projects-heading" style={{ backgroundColor: 'var(--bg-surface)' }}>
=======
    <section className="py-24 relative border-t border-[#1E2D4A]" aria-labelledby="projects-heading">
>>>>>>> af142b9d2c2736c934f34a0bf6f848ee0e41db28
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bx-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bx-border to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: '#9333EA' }}
            >
              Our Work
            </motion.p>
            <motion.h2
              id="projects-heading"
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]"
            >
              Recent Projects
            </motion.h2>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: '#9333EA' }}
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="group card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200"
            >
              <div className="h-36 flex items-center justify-center relative" style={{ background: p.bg }}>
                <span className="text-5xl">{p.emoji}</span>
                <button
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.5)' }}
                  aria-label={`View ${p.title}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-5">
                <span
                  className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2"
                  style={{ color: p.color, background: `${p.color}18` }}
                >
                  {p.category}
                </span>
                <h3 className="font-semibold text-sm mb-1.5 text-[var(--text-primary)]">{p.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{p.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}