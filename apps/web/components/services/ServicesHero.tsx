'use client'
import { motion } from 'framer-motion'

export function ServicesHero() {
  return (
    <section className="pt-28 pb-14 bg-bx-navy text-center">
      <div className="max-w-4xl mx-auto px-4">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono font-semibold text-bx-blue uppercase tracking-[0.2em] mb-3">What We Build</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl sm:text-5xl font-bold text-bx-white mb-5">Digital Solutions That Scale</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-bx-slate text-lg max-w-xl mx-auto">From MVPs to enterprise platforms — we design, build, and ship products that solve real problems.</motion.p>
      </div>
    </section>
  )
}