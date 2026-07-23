import type { Metadata } from 'next'
import { AboutHero } from '@/components/about/AboutHero'
import { MissionSection } from '@/components/about/MissionSection'
import { TeamSection } from '@/components/about/TeamSection'
import { CTA } from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Bytherix — our mission to empower the next generation of developers and security professionals.',
  alternates: { canonical: 'https://bytherix.com/about' },
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionSection />
      <TeamSection />
      <CTA />
    </>
  )
}