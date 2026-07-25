import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TrainingHero } from '@/components/courses/TrainingHero'
import { CourseGrid } from '@/components/courses/CourseGrid'

export const metadata: Metadata = {
  title: 'Training & Courses',
  description: 'Browse 100+ expert-led courses in AI, Ethical Hacking, Web Development, Robotics and more.',
  alternates: { canonical: 'https://bytherix.com/training' },
}

type Props = { searchParams: Promise<{ q?: string; category?: string; level?: string }> }

export default async function TrainingPage({ searchParams }: Props) {
  const filters = await searchParams
  return (
    <>
      <Suspense fallback={null}>
        <TrainingHero />
      </Suspense>
      <CourseGrid filters={filters} />
    </>
  )
}