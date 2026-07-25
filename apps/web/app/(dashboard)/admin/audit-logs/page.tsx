'use client'
import { useState } from 'react'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { useAdminAuditLogs } from '@/hooks/useAdmin'

function who(entry: { userId?: { firstName: string; lastName: string; email: string } | string }) {
  if (!entry.userId) return 'System'
  if (typeof entry.userId === 'string') return entry.userId
  return `${entry.userId.firstName} ${entry.userId.lastName}`
}

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useAdminAuditLogs({ page, limit: 30 })

  return (
    <div className="space-y-4">
      <div className="bx-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-bx-border rounded-xl animate-pulse" />)}</div>
        ) : isError ? (
          <div className="p-10 text-center">
            <AlertTriangle className="w-6 h-6 text-bx-red mx-auto mb-2" />
            <p className="text-bx-slate text-sm">Couldn&apos;t load audit logs.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bx-border text-left">
                <th className="px-4 py-3 text-bx-muted font-medium">Action</th>
                <th className="px-4 py-3 text-bx-muted font-medium hidden sm:table-cell">User</th>
                <th className="px-4 py-3 text-bx-muted font-medium hidden md:table-cell">IP</th>
                <th className="px-4 py-3 text-bx-muted font-medium">Result</th>
                <th className="px-4 py-3 text-bx-muted font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((log) => (
                <tr key={log._id} className="border-b border-bx-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="text-bx-white font-medium">{log.action}</p>
                    <p className="text-bx-muted text-xs">{log.resource}{log.resourceId ? ` · ${log.resourceId}` : ''}</p>
                  </td>
                  <td className="px-4 py-3 text-bx-slate hidden sm:table-cell">{who(log)}</td>
                  <td className="px-4 py-3 text-bx-slate hidden md:table-cell">{log.ip}</td>
                  <td className="px-4 py-3">
                    {log.success
                      ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-bx-green-light"><CheckCircle2 className="w-3.5 h-3.5" /> Success</span>
                      : <span className="inline-flex items-center gap-1 text-xs font-semibold text-bx-red"><XCircle className="w-3.5 h-3.5" /> Failed</span>}
                  </td>
                  <td className="px-4 py-3 text-bx-muted text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {data?.data.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-bx-muted text-sm">No audit log entries yet.</td></tr>
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
