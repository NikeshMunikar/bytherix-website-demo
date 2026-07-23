'use client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const projects = [
  { title: 'E-Commerce Platform',        category: 'Web Development',  color: '#1452CC', emoji: '🛒', bg: 'from-blue-950 to-blue-900',    desc: 'Full-featured store with Stripe payments and admin dashboard.' },
  { title: 'School Management System',   category: 'Web Development',  color: '#16A34A', emoji: '🏫', bg: 'from-green-950 to-green-900',  desc: 'Multi-role SaaS for schools — attendance, grades, timetables.' },
  { title: 'Mobile Banking App',         category: 'App Development',  color: '#0EA5E9', emoji: '💳', bg: 'from-sky-950 to-sky-900',      desc: 'Secure fintech app with biometric auth and real-time transactions.' },
  { title: 'Security Audit Report Tool', category: 'Security Testing', color: '#DC2626', emoji: '🛡️', bg: 'from-red-950 to-red-900',      desc: 'Automated VAPT reporting with 16-phase assessment pipeline.' },
  { title: 'AI Chatbot Assistant',       category: 'AI & Automation',  color: '#F59E0B', emoji: '🤖', bg: 'from-amber-950 to-amber-900',  desc: 'RAG-powered customer service bot with multi-language support.' },
  { title: 'Multiplayer Game Prototype', category: 'Game Development', color: '#9333EA', emoji: '🎮', bg: 'from-purple-950 to-purple-900', desc: 'Real-time multiplayer arena built with Unity and Photon.' },
  { title: 'CTF Platform',              category: 'Security Testing',  color: '#DC2626', emoji: '⚡', bg: 'from-red-950 to-red-900',      desc: 'Internal competition platform with dynamic challenges.' },
  { title: 'NEPSE Analytics Dashboard', category: 'Web Development',   color: '#22C55E', emoji: '📈', bg: 'from-green-950 to-green-900',  desc: 'Real-time stock market data visualization for NEPSE.' },
  { title: 'LMS Platform',              category: 'Web Development',   color: '#1452CC', emoji: '📚', bg: 'from-blue-950 to-blue-900',    desc: 'Full-featured learning management system with video streaming.' },
]

export function ProjectsGrid() {
  return (
    <section className="py-20 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.article key={p.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group bx-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200">
              <div className={`h-36 bg-gradient-to-br ${p.bg} flex items-center justify-center relative`}>
                <span className="text-5xl">{p.emoji}</span>
                <button className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-all" aria-label="View">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-5">
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2" style={{ color: p.color, background: `${p.color}18` }}>{p.category}</span>
                <h3 className="text-bx-white font-semibold text-sm mb-1.5">{p.title}</h3>
                <p className="text-bx-muted text-xs leading-relaxed">{p.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}