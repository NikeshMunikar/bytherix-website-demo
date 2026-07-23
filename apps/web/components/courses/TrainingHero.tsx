'use client'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export function TrainingHero() {
  return (
    <section className="pt-28 pb-14 bg-bx-navy text-center relative">
      <div className="circuit-grid absolute inset-0 opacity-50" />
      <div className="relative max-w-3xl mx-auto px-4">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs font-mono font-semibold text-bx-blue uppercase tracking-[0.2em] mb-3">
          Training & Courses
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="text-4xl sm:text-5xl font-bold text-bx-white mb-5">
          Learn In-Demand Skills
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-bx-slate mb-8">
          100+ expert-led courses with real projects, certificates, and career support.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bx-muted" />
            <input type="search" placeholder="Search courses..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-bx-card border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue transition-colors" />
          </div>
          <button className="px-5 py-3 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors">
            Search
          </button>
        </motion.div>
      </div>
    </section>
  )
}