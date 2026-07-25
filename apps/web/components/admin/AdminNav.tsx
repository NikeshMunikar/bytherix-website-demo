'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, ScrollText, Newspaper } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { icon: LayoutDashboard, label: 'Overview',    href: '/admin' },
  { icon: Users,           label: 'Users',       href: '/admin/users' },
  { icon: BookOpen,        label: 'Courses',     href: '/admin/courses' },
  { icon: Newspaper,       label: 'Blog',        href: '/admin/blog' },
  { icon: ScrollText,      label: 'Audit Logs',  href: '/admin/audit-logs' },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <div>
      <h1 className="text-2xl font-bold text-bx-white mb-4">Admin</h1>
      <nav className="flex items-center gap-1 border-b border-bx-border overflow-x-auto">
        {tabs.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href}
              className={cn('flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors',
                active ? 'border-bx-blue text-bx-white' : 'border-transparent text-bx-muted hover:text-bx-slate')}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
