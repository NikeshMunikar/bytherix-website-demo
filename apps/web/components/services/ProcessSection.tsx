'use client'
import { motion } from 'framer-motion'

const steps = [
  { num: '01', title: 'Discovery',   desc: 'We understand your goals, users, and technical requirements.' },
  { num: '02', title: 'Design',      desc: 'Wireframes, prototypes, and design systems built for your brand.' },
  { num: '03', title: 'Development', desc: 'Agile sprints with weekly demos and full transparency.' },
  { num: '04', title: 'Testing',     desc: 'QA, security audits, and performance testing before launch.' },
  { num: '05', title: 'Deployment',  desc: 'CI/CD pipeline, monitoring, and smooth go-live.' },
  { num: '06', title: 'Support',     desc: 'Ongoing maintenance, updates, and feature development.' },
]

export function ProcessSection() {
  return (
    <section className="py-24 bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-mono font-semibold text-bx-green uppercase tracking-[0.2em] mb-3">How We Work</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-bx-white">Our Process</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bx-card p-6 rounded-2xl">
              <span className="text-4xl font-black text-bx-border mb-4 block">{s.num}</span>
              <h3 className="text-bx-white font-semibold mb-2">{s.title}</h3>
              <p className="text-bx-muted text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}