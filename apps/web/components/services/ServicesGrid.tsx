'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Monitor, Smartphone, Gamepad2, ShieldCheck, Bot, Cloud, ArrowRight } from 'lucide-react'

const services = [
  { icon: Monitor,     title: 'Web Development',  desc: 'React, Next.js, TypeScript — modern, fast, SEO-ready.',       href: '/services/web-development',  color: '#1452CC', dim: 'rgba(20,82,204,0.1)' },
  { icon: Smartphone,  title: 'App Development',  desc: 'Flutter, React Native — cross-platform mobile apps.',          href: '/services/app-development',  color: '#22C55E', dim: 'rgba(34,197,94,0.1)' },
  { icon: Gamepad2,    title: 'Game Development', desc: 'Unity 2D/3D — web, mobile and desktop games.',                 href: '/services/game-development', color: '#9333EA', dim: 'rgba(147,51,234,0.1)' },
  { icon: ShieldCheck, title: 'Security Testing', desc: 'VAPT, pentest, code review — OWASP Top 10 coverage.',          href: '/services/security',         color: '#DC2626', dim: 'rgba(220,38,38,0.1)' },
  { icon: Bot,         title: 'AI & Automation',  desc: 'LLM integrations, RAG pipelines, automation bots.',            href: '/services/ai-automation',    color: '#F59E0B', dim: 'rgba(245,158,11,0.1)' },
  { icon: Cloud,       title: 'Cloud & DevOps',   desc: 'AWS, GCP, Docker, CI/CD — your infra, handled.',               href: '/services/cloud-devops',     color: '#0EA5E9', dim: 'rgba(14,165,233,0.1)' },
]

export function ServicesGrid() {
  return (
    <section className="py-20 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link href={s.href} className="group block bx-card p-7 rounded-2xl hover:-translate-y-1 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: s.dim }}>
                    <Icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="text-bx-white font-semibold text-base mb-2">{s.title}</h3>
                  <p className="text-bx-muted text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: s.color }}>
                    Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}