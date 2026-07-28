'use client'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter } from 'lucide-react'

const team = [
  { name: 'Anish Parajuli',   role: 'Founder & Lead Developer',      initials: 'AP', color: '#1452CC' },
  { name: 'Nikesh Munikar',     role: 'MD & Full Stack Developer',        initials: 'NM', color: '#DC2626' },
  { name: 'Prabind Kumar Mahato',     role: 'HR & Digital Forensics',   initials: 'PKM', color: '#22C55E' },
  { name: 'Namling Limbu',     role: 'Creative Head',              initials: 'NL', color: '#F59E0B' },
  { name: 'Shriya Pantha',      role: 'Project Manager & MERN Developer',       initials: 'SP', color: '#0EA5E9' },
  { name: 'Anjit Paswani', role: 'Client Relationship Manager',   initials: 'AP', color: '#9333EA' }
]

export function TeamSection() {
  return (
    <section className="py-20 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-mono font-semibold text-bx-amber uppercase tracking-[0.2em] mb-3">The Team</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-bx-white">Meet the Builders</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="bx-card p-6 rounded-2xl flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shrink-0" style={{ background: `${member.color}20`, color: member.color, border: `1px solid ${member.color}30` }}>
                {member.initials}
              </div>
              <div>
                <h3 className="text-bx-white font-semibold text-sm mb-0.5">{member.name}</h3>
                <p className="text-bx-muted text-xs mb-3">{member.role}</p>
                <div className="flex gap-2">
                  {[Github, Linkedin, Twitter].map((Icon, j) => (
                    <a key={j} href="#" className="w-6 h-6 rounded flex items-center justify-center text-bx-muted hover:text-bx-white transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}