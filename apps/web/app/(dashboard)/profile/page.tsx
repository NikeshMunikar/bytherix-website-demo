import type { Metadata } from 'next'
import { ProfileForm } from '@/components/dashboard/ProfileForm'

export const metadata: Metadata = { title: 'Profile', robots: { index: false, follow: false } }

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bx-white">Profile</h1>
        <p className="text-bx-slate text-sm">Manage your personal information.</p>
      </div>
      <ProfileForm />
    </div>
  )
}