'use client'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { FileVideo, Loader2, CheckCircle2, UploadCloud } from 'lucide-react'
import { useVideoUpload } from '@/hooks/useVideoUpload'

type Props = {
  value?: string
  onChange: (url: string) => void
}

export function VideoUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const upload = useVideoUpload(setProgress)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    setProgress(0)
    upload.mutate(file, {
      onSuccess: (data) => { onChange(data.url); toast.success('Video uploaded') },
      onError: (err) => {
        const message = isAxiosError(err) ? err.response?.data?.error : undefined
        toast.error(message ?? 'Video upload failed. Please try again.')
      },
    })
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !upload.isPending && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bx-navy border border-dashed border-bx-border hover:border-bx-blue transition-colors cursor-pointer"
      >
        {upload.isPending ? (
          <Loader2 className="w-4 h-4 text-bx-blue animate-spin shrink-0" />
        ) : value ? (
          <CheckCircle2 className="w-4 h-4 text-bx-green-light shrink-0" />
        ) : (
          <UploadCloud className="w-4 h-4 text-bx-muted shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          {upload.isPending ? (
            <p className="text-sm text-bx-white">Uploading... {progress}%</p>
          ) : value ? (
            <p className="text-sm text-bx-white truncate flex items-center gap-1.5"><FileVideo className="w-3.5 h-3.5 shrink-0" /> Video uploaded</p>
          ) : (
            <p className="text-sm text-bx-slate">Click to upload a video (MP4, WebM, MOV — up to 500MB)</p>
          )}
        </div>
      </div>

      {upload.isPending && (
        <div className="h-1.5 bg-bx-border rounded-full overflow-hidden">
          <div className="h-full bg-bx-blue transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      )}

      <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  )
}
