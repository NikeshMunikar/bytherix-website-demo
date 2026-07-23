import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings', robots: { index: false, follow: false } }

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-bx-white">Settings</h1>
      <p className="text-bx-slate text-sm">Manage your account settings and preferences.</p>
    </div>
  )
}