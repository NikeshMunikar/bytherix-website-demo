'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ChevronRight } from 'lucide-react'
import { DHOverlay } from '@/components/demon-hunters/DHOverlay'

export function DemonHuntersBanner() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-green-900 bg-black p-8 sm:p-12 cursor-pointer group"
            onClick={() => setOpen(true)}
          >
            {/* Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.02) 2px, rgba(0,255,0,0.02) 4px)',
              }}
            />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-red-600 flex items-center justify-center bg-red-950">
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="font-mono text-green-400 text-xl font-bold tracking-widest">
                    DEMON_HUNTERS
                  </h3>
                  <p className="font-mono text-green-700 text-sm mt-1">
                    Cyber Security Division · CTF Champions · Ethical Hacking
                  </p>
                </div>
              </div>

              <div
                className="inline-flex items-center gap-2 font-mono text-sm bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded transition-colors"
              >
                ENTER_THE_ZONE
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <DHOverlay open={open} onClose={() => setOpen(false)} />
    </>
  )
}