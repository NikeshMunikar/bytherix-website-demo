'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, User, Settings, LogOut, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { apiClient } from '@/lib/api-client'

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard' },
  { icon: BookOpen,        label: 'My Learning', href: '/my-learning' },
  { icon: User,            label: 'Profile',     href: '/profile' },
  { icon: Settings,        label: 'Settings',    href: '/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    try { await apiClient.post('/auth/logout') } finally { logout(); router.push('/') }
  }

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-bx-border bg-bx-card min-h-screen">
      <div className="px-5 py-4 border-b border-bx-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden">
            <Image src="/logo.jpg" alt="Bytherix" fill sizes="32px" className="object-cover" />
          </div>
          <span className="font-bold text-base">
            <span className="text-bx-white">By</span><span className="text-bx-blue">the</span><span className="text-bx-green-light">rix</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group',
                active ? 'bg-bx-blue/15 text-bx-white border border-bx-blue/20' : 'text-bx-slate hover:text-bx-white hover:bg-white/5')}>
              <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-bx-blue' : 'text-bx-muted group-hover:text-bx-slate')} />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-bx-blue" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-bx-border space-y-2">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-bx-blue/20 border border-bx-blue/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-bx-blue">{user.firstName[0]}{user.lastName[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-bx-white text-xs font-semibold truncate">{user.firstName} {user.lastName}</p>
              <p className="text-bx-muted text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-bx-slate hover:text-bx-red hover:bg-bx-red/5 transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  )
}