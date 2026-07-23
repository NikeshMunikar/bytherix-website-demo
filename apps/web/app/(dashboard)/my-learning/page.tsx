import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Learning', robots: { index: false, follow: false } }

export default function MyLearningPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bx-white">My Learning</h1>
      <p className="text-bx-slate text-sm">Your enrolled courses will appear here.</p>
    </div>
  )
}