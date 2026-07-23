import type { Metadata } from 'next'
import { ProjectsGrid } from '@/components/projects/ProjectsGrid'
import { CTA } from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'Projects & Portfolio',
  description: "Explore Bytherix's portfolio of web apps, mobile apps, AI solutions, and security projects.",
  alternates: { canonical: 'https://bytherix.com/projects' },
}

export default function ProjectsPage() {
  return (
    <>
      <section className="pt-28 pb-12 bg-bx-navy text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-mono font-semibold text-bx-purple uppercase tracking-[0.2em] mb-3">Our Work</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-bx-white mb-4">Projects & Portfolio</h1>
          <p className="text-bx-slate max-w-xl mx-auto">Real solutions built for real businesses.</p>
        </div>
      </section>
      <ProjectsGrid />
      <CTA />
    </>
  )
}