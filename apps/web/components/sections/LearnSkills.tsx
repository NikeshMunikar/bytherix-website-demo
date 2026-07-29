'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, Bot, ShieldAlert, Globe, Smartphone, Gamepad2, Megaphone, ArrowRight } from 'lucide-react'

const skills = [
  { icon: Brain,      title: 'AI / Machine Learning', count: '24 courses', href: '/training/ai-ml',             color: '#1452CC', dim: 'rgba(20,82,204,0.08)' },
  { icon: Bot,        title: 'Robotics & IoT',        count: '12 courses', href: '/training/robotics',          color: '#16A34A', dim: 'rgba(22,163,74,0.08)' },
  { icon: ShieldAlert,title: 'Ethical Hacking',       count: '18 courses', href: '/training/cyber-security',    color: '#DC2626', dim: 'rgba(220,38,38,0.08)' },
  { icon: Globe,      title: 'Web Development',       count: '32 courses', href: '/training/web-development',   color: '#0EA5E9', dim: 'rgba(14,165,233,0.08)' },
  { icon: Smartphone, title: 'App Development',       count: '16 courses', href: '/training/app-development',   color: '#22C55E', dim: 'rgba(34,197,94,0.08)' },
  { icon: Gamepad2,   title: 'Game Development',      count: '10 courses', href: '/training/game-development',  color: '#9333EA', dim: 'rgba(147,51,234,0.08)' },
  { icon: Megaphone,  title: 'Digital Marketing',     count: '8 courses',  href: '/training/digital-marketing', color: '#F59E0B', dim: 'rgba(245,158,11,0.08)' },
]

export function LearnSkills() {
  return (
<section className="py-28 md:py-32 relative" aria-labelledby="skills-heading" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bx-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bx-border to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-xs font-mono font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: '#22C55E' }}
          >
            Learn In-Demand Skills
          </motion.p>
          <motion.h2
            id="skills-heading"
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text-primary)]"
          >
            Explore Learning Tracks
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="max-w-lg mx-auto text-[var(--text-secondary)]"
          >
            Structured paths from beginner to expert, taught by industry professionals with real project experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {skills.map((skill, i) => {
            const Icon = skill.icon
            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={skill.href}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 bg-[var(--bg-surface)] border-[var(--border)]"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200"
                    style={{ background: skill.dim }}
                  >
                    <Icon className="w-6 h-6" style={{ color: skill.color }} />
                  </div>
                  <h3 className="text-xs font-semibold mb-1 leading-tight text-[var(--text-primary)]">{skill.title}</h3>
                  <p className="text-xs mb-3 text-[var(--text-secondary)]">{skill.count}</p>
                  <span
                    className="inline-flex items-center gap-0.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: skill.color }}
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/training"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold text-sm transition-all duration-200"
            style={{ borderColor: 'rgba(20,82,204,0.4)', color: '#1452CC' }}
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}