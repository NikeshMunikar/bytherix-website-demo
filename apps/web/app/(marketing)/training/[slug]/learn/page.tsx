import type { Metadata } from 'next'
import { LessonPlayer } from '@/components/lessons/LessonPlayer'

export const metadata: Metadata = { title: 'Learn', robots: { index: false, follow: false } }

type Props = { params: Promise<{ slug: string }> }

export default async function LearnPage({ params }: Props) {
  const { slug } = await params
  return <LessonPlayer slug={slug} />
}
