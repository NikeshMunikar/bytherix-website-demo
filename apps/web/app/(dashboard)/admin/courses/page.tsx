'use client'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { useAdminCourses, useDeleteCourse } from '@/hooks/useAdminCourses'
import { formatCurrency } from '@/lib/utils'

export default function AdminCoursesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useAdminCourses({ page, limit: 20 })
  const deleteCourse = useDeleteCourse()

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This can't easily be undone.`)) return
    deleteCourse.mutate(id, {
      onSuccess: () => toast.success('Course deleted'),
      onError:   () => toast.error('Could not delete course'),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/courses/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> New course
        </Link>
      </div>

      <div className="bx-card rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-bx-border rounded-xl animate-pulse" />)}</div>
        ) : isError ? (
          <div className="p-10 text-center">
            <AlertTriangle className="w-6 h-6 text-bx-red mx-auto mb-2" />
            <p className="text-bx-slate text-sm">Couldn&apos;t load courses.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bx-border text-left">
                <th className="px-4 py-3 text-bx-muted font-medium">Course</th>
                <th className="px-4 py-3 text-bx-muted font-medium hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-bx-muted font-medium hidden md:table-cell">Price</th>
                <th className="px-4 py-3 text-bx-muted font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((c) => (
                <tr key={c._id} className="border-b border-bx-border last:border-0">
                  <td className="px-4 py-3 text-bx-white font-medium max-w-xs truncate">{c.title}</td>
                  <td className="px-4 py-3 text-bx-slate hidden sm:table-cell">{c.category}</td>
                  <td className="px-4 py-3 text-bx-slate hidden md:table-cell">{formatCurrency(c.price, c.currency || 'NPR')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${c.isPublished ? 'bg-bx-green/15 text-bx-green-light' : 'bg-bx-muted/15 text-bx-muted'}`}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {c.isFeatured && <span className="ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-bx-amber/15 text-bx-amber">Featured</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/courses/${c._id}`}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-bx-muted hover:text-bx-blue-light hover:bg-bx-blue/10 transition-colors" aria-label="Edit course">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(c._id, c.title)} disabled={deleteCourse.isPending}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-bx-muted hover:text-bx-red hover:bg-bx-red/10 transition-colors disabled:opacity-30" aria-label="Delete course">
                        {deleteCourse.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data?.data.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-bx-muted text-sm">No courses yet.</td></tr>
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
