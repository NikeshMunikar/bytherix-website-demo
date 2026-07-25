import type { Metadata } from 'next'
import { MyLearningGrid } from '@/components/dashboard/MyLearningGrid'

export const metadata: Metadata = { title: 'My Learning', robots: { index: false, follow: false } }

export default function MyLearningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bx-white">My Learning</h1>
        <p className="text-bx-slate text-sm">Pick up where you left off.</p>
      </div>
      <MyLearningGrid />
    </div>
  )
}