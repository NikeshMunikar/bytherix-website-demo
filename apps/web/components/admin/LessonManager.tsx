'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { Plus, Trash2, GripVertical, Loader2, Video } from 'lucide-react'
import { useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson, type LessonInput } from '@/hooks/useLessons'
import type { VideoSource } from '@/lib/types/lesson'

const inputClass = 'px-3 py-2 rounded-lg bg-bx-navy border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue transition-colors'

const emptyForm = { title: '', videoSource: 'youtube' as VideoSource, videoUrl: '', durationMins: 5, isPreview: false }

export function LessonManager({ courseId }: { courseId: string }) {
  const { data: lessons, isLoading } = useLessons(courseId)
  const create = useCreateLesson(courseId)
  const update = useUpdateLesson(courseId)
  const remove = useDeleteLesson(courseId)
  const [form, setForm] = useState(emptyForm)

  const sorted = [...(lessons ?? [])].sort((a, b) => a.order - b.order)

  const handleAdd = async () => {
    if (!form.title.trim() || !form.videoUrl.trim()) {
      toast.error('Title and video URL are required')
      return
    }
    const input: LessonInput = { course: courseId, ...form }
    try {
      await create.mutateAsync(input)
      toast.success('Lesson added')
      setForm(emptyForm)
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined
      toast.error(message ?? 'Could not add lesson')
    }
  }

  const handleTogglePreview = (id: string, isPreview: boolean) => {
    update.mutate({ id, input: { isPreview: !isPreview } }, {
      onError: () => toast.error('Could not update lesson'),
    })
  }

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete lesson "${title}"?`)) return
    remove.mutate(id, {
      onSuccess: () => toast.success('Lesson deleted'),
      onError:   () => toast.error('Could not delete lesson'),
    })
  }

  return (
    <div className="bx-card rounded-2xl p-6 max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold text-bx-white">Lessons</h2>

      {isLoading ? (
        <div className="h-24 bg-bx-border rounded-xl animate-pulse" />
      ) : sorted.length === 0 ? (
        <p className="text-bx-muted text-sm">No lessons yet — add the first one below.</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((lesson) => (
            <div key={lesson._id} className="flex items-center gap-2 rounded-xl border border-bx-border px-3 py-2.5">
              <GripVertical className="w-4 h-4 text-bx-muted shrink-0" />
              <Video className="w-4 h-4 text-bx-blue-light shrink-0" />
              <span className="text-sm text-bx-white flex-1 truncate">{lesson.title}</span>
              <span className="text-xs text-bx-muted shrink-0">{lesson.durationMins}m</span>
              <label className="flex items-center gap-1.5 text-xs text-bx-slate shrink-0">
                <input type="checkbox" checked={lesson.isPreview} onChange={() => handleTogglePreview(lesson._id, lesson.isPreview)}
                  className="rounded border-bx-border" />
                Preview
              </label>
              <button onClick={() => handleDelete(lesson._id, lesson.title)}
                className="w-7 h-7 rounded-lg inline-flex items-center justify-center text-bx-muted hover:text-bx-red hover:bg-bx-red/10 transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-bx-border pt-4 space-y-3">
        <p className="text-sm font-medium text-bx-slate">Add a lesson</p>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Lesson title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`${inputClass} col-span-2`} />
          <select value={form.videoSource} onChange={(e) => setForm({ ...form, videoSource: e.target.value as VideoSource })} className={inputClass}>
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="upload">Uploaded file</option>
            <option value="external">External URL</option>
          </select>
          <input type="number" min={0} placeholder="Duration (min)" value={form.durationMins}
            onChange={(e) => setForm({ ...form, durationMins: Number(e.target.value) })} className={inputClass} />
          <input placeholder="Video URL" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className={`${inputClass} col-span-2`} />
          <label className="flex items-center gap-2 text-sm text-bx-slate col-span-2">
            <input type="checkbox" checked={form.isPreview} onChange={(e) => setForm({ ...form, isPreview: e.target.checked })} className="rounded border-bx-border" />
            Free preview (visible without enrolling)
          </label>
        </div>
        <button onClick={handleAdd} disabled={create.isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold transition-colors disabled:opacity-50">
          {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add lesson
        </button>
      </div>
    </div>
  )
}
