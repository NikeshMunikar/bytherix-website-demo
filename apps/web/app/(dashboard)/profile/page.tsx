import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profile', robots: { index: false, follow: false } }

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bx-white">Profile</h1>
      <p className="text-bx-slate text-sm">Manage your personal information.</p>
    </div>
  )
}