'use client'
import { useRef } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useFileUpload } from '@/hooks/useFileUpload'
import { isAxiosError } from 'axios'

type Props = {
  value?: string
  onChange: (url: string) => void
  shape?: 'square' | 'circle'
  size?: number
}

export function ImageUpload({ value, onChange, shape = 'square', size = 96 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useFileUpload()

  const handleFile = (file: File | undefined) => {
    if (!file) return
    upload.mutate(file, {
      onSuccess: (data) => onChange(data.url),
      onError: (err) => {
        const message = isAxiosError(err) ? err.response?.data?.error : undefined
        toast.error(message ?? 'Upload failed. Please try again.')
      },
    })
  }

  return (
    <div className="flex items-center gap-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        style={{ width: size, height: size }}
        className={`relative shrink-0 flex items-center justify-center bg-bx-navy border border-dashed border-bx-border hover:border-bx-blue transition-colors cursor-pointer overflow-hidden ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'}`}
      >
        {upload.isPending ? (
          <Loader2 className="w-5 h-5 text-bx-blue animate-spin" />
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
        ) : (
          <ImagePlus className="w-5 h-5 text-bx-muted" />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={upload.isPending}
          className="text-sm font-semibold text-bx-blue-light hover:text-bx-blue transition-colors disabled:opacity-50 text-left">
          {value ? 'Change image' : 'Upload image'}
        </button>
        {value && (
          <button type="button" onClick={() => onChange('')}
            className="flex items-center gap-1 text-xs text-bx-muted hover:text-bx-red transition-colors text-left">
            <X className="w-3 h-3" /> Remove
          </button>
        )}
        <p className="text-xs text-bx-muted">JPEG, PNG, WebP or GIF, up to 5MB.</p>
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  )
}
