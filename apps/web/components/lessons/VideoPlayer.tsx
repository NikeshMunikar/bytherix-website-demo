'use client'
import type { VideoSource } from '@/lib/types/lesson'

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return match?.[1] ?? null
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match?.[1] ?? null
}

export function VideoPlayer({ source, url }: { source: VideoSource; url: string }) {
  if (source === 'youtube') {
    const id = extractYoutubeId(url)
    if (id) {
      return (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="Lesson video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }
  }

  if (source === 'vimeo') {
    const id = extractVimeoId(url)
    if (id) {
      return (
        <iframe
          className="w-full h-full"
          src={`https://player.vimeo.com/video/${id}`}
          title="Lesson video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    }
  }

  return (
    <video className="w-full h-full" src={url} controls controlsList="nodownload" />
  )
}
