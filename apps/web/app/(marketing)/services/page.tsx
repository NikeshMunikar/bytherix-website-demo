import type { Metadata } from 'next'
import { ServicesHero } from '@/components/services/ServicesHero'
import { ServicesGrid } from '@/components/services/ServicesGrid'
import { ProcessSection } from '@/components/services/ProcessSection'
import { CTA } from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Bytherix builds web apps, mobile apps, AI solutions, and security audits.',
  alternates: { canonical: 'https://bytherix.com/services' },
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <ProcessSection />
      <CTA />
    </>
  )
}