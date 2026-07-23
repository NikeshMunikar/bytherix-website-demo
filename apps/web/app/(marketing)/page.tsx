import type { Metadata } from 'next'
import { Hero } from '@/components/sections/Hero'
import { WhatWeDo } from '@/components/sections/WhatWeDo'
import { LearnSkills } from '@/components/sections/LearnSkills'
import { FeaturedCourses } from '@/components/sections/FeaturedCourses'
import { RecentProjects } from '@/components/sections/RecentProjects'
import { Stats } from '@/components/sections/Stats'
import { Testimonials } from '@/components/sections/Testimonials'
import { DemonHuntersBanner } from '@/components/sections/DemonHuntersBanner'
import { CTA } from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'Bytherix — Build. Learn. Secure. Innovate.',
  alternates: { canonical: 'https://bytherix.com' },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <LearnSkills />
      <FeaturedCourses />
      <RecentProjects />
      <Stats />
      <Testimonials />
      <DemonHuntersBanner />
      <CTA />
    </>
  )
}