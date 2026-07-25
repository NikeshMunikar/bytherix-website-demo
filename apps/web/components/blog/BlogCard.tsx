import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { Post } from '@/lib/types/post'

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group bx-card rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-200">
      <div className="relative h-44 bg-bx-border overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        {post.tags[0] && <p className="text-xs text-bx-blue-light font-semibold mb-2 uppercase tracking-wide">{post.tags[0]}</p>}
        <h3 className="text-base font-semibold text-bx-white leading-snug mb-2 line-clamp-2 group-hover:text-bx-blue-light transition-colors">{post.title}</h3>
        <p className="text-bx-slate text-sm line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-bx-muted">
          <span>{post.author.firstName} {post.author.lastName}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTimeMins} min read</span>
        </div>
      </div>
    </Link>
  )
}
