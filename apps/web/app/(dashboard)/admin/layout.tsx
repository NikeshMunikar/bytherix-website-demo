import { RequireAuth } from '@/components/auth/RequireAuth'
import { AdminNav } from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <AdminNav />
        {children}
      </div>
    </RequireAuth>
  )
}
