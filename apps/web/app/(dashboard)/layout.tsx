import { Suspense } from 'react'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { RequireAuth } from '@/components/auth/RequireAuth'

// This entire route group is a personalized, authenticated area (client-side
// auth store, usePathname-based nav highlighting) with no static-generation
// value — every page here is already noindex. The Suspense boundary below is
// how Next 16 Cache Components expects a route to opt out of static
// prerendering (the old `export const dynamic = 'force-dynamic'` escape hatch
// is explicitly disallowed once cacheComponents is enabled).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bx-navy" />}>
      <div className="min-h-screen bg-bx-navy flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 p-6 overflow-auto">
            <RequireAuth>{children}</RequireAuth>
          </main>
        </div>
      </div>
    </Suspense>
  )
}