'use client'

import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useRef, useEffect, useState } from 'react'
import { Users, BookOpen, Cpu, Shield } from 'lucide-react'

const stats = [
  { icon: Users, value: 500, suffix: '+', label: 'Students Trained', color: 'text-blue-500' },
  { icon: BookOpen, value: 50, suffix: '+', label: 'Projects Delivered', color: 'text-green-500' },
  { icon: Cpu, value: 20, suffix: '+', label: 'Technologies', color: 'text-red-500' },
  { icon: Shield, value: 95, suffix: '%', label: 'Client Satisfaction', color: 'text-yellow-500' },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const { isIntersecting } = useIntersectionObserver(ref, { threshold: 0.5 })
  const started = useRef(false)

  useEffect(() => {
    if (isIntersecting && !started.current) {
      started.current = true
      const duration = 1500
      const steps = 60
      const increment = target / steps
      let current = 0
      const timer = setInterval(() => {
        current = Math.min(current + increment, target)
        setCount(Math.floor(current))
        if (current >= target) clearInterval(timer)
      }, duration / steps)
    }
  }, [isIntersecting, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export function Stats() {
  return (
    <section className="py-20 border-t border-[#1E2D4A]" style={{ background: 'linear-gradient(90deg, #0A1628 0%, #0F2A5C 50%, #0F5C33 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 ${stat.color} mb-4`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className={`text-4xl font-bold text-white mb-1 ${stat.color}`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/70 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}