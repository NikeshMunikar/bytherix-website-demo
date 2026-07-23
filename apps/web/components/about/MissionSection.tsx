'use client'
import { motion } from 'framer-motion'
import { Target, Eye, Heart } from 'lucide-react'

const items = [
  { icon: Target, title: 'Our Mission',  color: '#1452CC', dim: 'rgba(20,82,204,0.1)',  desc: 'To make world-class tech education accessible to everyone and build digital solutions that help businesses grow.' },
  { icon: Eye,    title: 'Our Vision',   color: '#22C55E', dim: 'rgba(34,197,94,0.1)',  desc: 'A world where every person has the skills to build, secure, and innovate with technology.' },
  { icon: Heart,  title: 'Our Values',   color: '#DC2626', dim: 'rgba(220,38,38,0.1)',  desc: 'Quality first. Hands-on learning. Real-world relevance. Community-driven. Integrity in everything we do.' },
]

export function MissionSection() {
  return (
    <section className="py-20 bg-[#050D1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bx-card p-8 rounded-2xl text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: item.dim }}>
                  <Icon className="w-7 h-7" style={{ color: item.color }} />
                </div>
                <h3 className="text-bx-white font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-bx-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}