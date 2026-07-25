'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Search, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from '@/hooks/useAdmin'
import { useAuth } from '@/hooks/useAuth'

const ROLES = ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] as const

export default function AdminUsersPage() {
  const { user: me } = useAuth()
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useAdminUsers({ q: q || undefined, role: role || undefined, page, limit: 20 })
  const updateRole = useUpdateUserRole()
  const deleteUser = useDeleteUser()

  const handleRoleChange = (id: string, newRole: string) => {
    updateRole.mutate({ id, role: newRole }, {
      onSuccess: () => toast.success('Role updated'),
      onError:   () => toast.error('Could not update role'),
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This can't easily be undone.`)) return
    deleteUser.mutate(id, {
      onSuccess: () => toast.success('User deleted'),
      onError:   () => toast.error('Could not delete user'),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bx-muted" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Search name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bx-card border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue" />
        </div>
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-xl bg-bx-card border border-bx-border text-bx-white text-sm focus:outline-none focus:border-bx-blue">
          <option value="">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="bx-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-bx-border rounded-xl animate-pulse" />)}</div>
        ) : isError ? (
          <div className="p-10 text-center">
            <AlertTriangle className="w-6 h-6 text-bx-red mx-auto mb-2" />
            <p className="text-bx-slate text-sm">Couldn&apos;t load users.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bx-border text-left">
                <th className="px-4 py-3 text-bx-muted font-medium">Name</th>
                <th className="px-4 py-3 text-bx-muted font-medium hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-bx-muted font-medium">Role</th>
                <th className="px-4 py-3 text-bx-muted font-medium hidden md:table-cell">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((u) => (
                <tr key={u._id} className="border-b border-bx-border last:border-0">
                  <td className="px-4 py-3 text-bx-white font-medium">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-bx-slate hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <select value={u.role} disabled={u._id === me?._id || updateRole.isPending}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="px-2 py-1 rounded-lg bg-bx-navy border border-bx-border text-bx-white text-xs disabled:opacity-50">
                      {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${u.isEmailVerified ? 'bg-bx-green/15 text-bx-green-light' : 'bg-bx-amber/15 text-bx-amber'}`}>
                      {u.isEmailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(u._id, `${u.firstName} ${u.lastName}`)}
                      disabled={u._id === me?._id || deleteUser.isPending}
                      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-bx-muted hover:text-bx-red hover:bg-bx-red/10 transition-colors disabled:opacity-30"
                      aria-label="Delete user">
                      {deleteUser.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
              {data?.data.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-bx-muted text-sm">No users found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {data && data.meta.pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 rounded-lg bg-bx-card border border-bx-border text-bx-slate disabled:opacity-40">Previous</button>
          <span className="text-bx-muted">Page {data.meta.page} of {data.meta.pages}</span>
          <button onClick={() => setPage((p) => Math.min(data.meta.pages, p + 1))} disabled={page === data.meta.pages}
            className="px-3 py-1.5 rounded-lg bg-bx-card border border-bx-border text-bx-slate disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}
