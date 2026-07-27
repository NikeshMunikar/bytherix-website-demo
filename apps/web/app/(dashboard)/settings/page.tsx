import type { Metadata } from 'next'
import { ChangePasswordForm } from '@/components/dashboard/ChangePasswordForm'
import { SessionsList } from '@/components/dashboard/SessionsList'
import { NotificationPrefs } from '@/components/dashboard/NotificationPrefs'
import { DangerZone } from '@/components/dashboard/DangerZone'

export const metadata: Metadata = { title: 'Settings', robots: { index: false, follow: false } }

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-bx-white">Settings</h1>
        <p className="text-bx-slate text-sm">Manage your account settings and security.</p>
      </div>
      <ChangePasswordForm />
      <NotificationPrefs />
      <SessionsList />
      <DangerZone />
    </div>
  )
}