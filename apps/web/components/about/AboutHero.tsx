'use client'
import { motion } from 'framer-motion'

export function AboutHero() {
  return (
    <section className="pt-28 pb-14 bg-bx-navy text-center">
      <div className="max-w-4xl mx-auto px-4">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono font-semibold text-bx-blue uppercase tracking-[0.2em] mb-3">About Bytherix</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl sm:text-5xl font-bold text-bx-white mb-5">We Build the Builders</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-bx-slate text-lg max-w-2xl mx-auto">
          Bytherix is a tech education and digital solutions company on a mission to empower the next generation
          of developers, engineers, and security professionals.
        </motion.p>
      </div>
    </section>
  )
}