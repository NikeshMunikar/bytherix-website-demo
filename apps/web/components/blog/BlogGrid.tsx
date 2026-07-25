'use client'
import { AlertTriangle, Newspaper } from 'lucide-react'
import { usePosts } from '@/hooks/usePosts'
import { BlogCard } from '@/components/blog/BlogCard'

function CardSkeleton() {
  return (
    <div className="bx-card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-bx-border" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/4 bg-bx-border rounded" />
        <div className="h-4 w-full bg-bx-border rounded" />
        <div className="h-4 w-2/3 bg-bx-border rounded" />
      </div>
    </div>
  )
}

export function BlogGrid({ filters }: { filters: { q?: string; tag?: string } }) {
  const { data, isLoading, isError, refetch } = usePosts({ ...filters, limit: 12 })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <AlertTriangle className="w-8 h-8 text-bx-red mx-auto mb-3" />
        <p className="text-bx-white font-medium mb-1">Couldn&apos;t load posts</p>
        <p className="text-bx-slate text-sm mb-4">Something went wrong. Please try again.</p>
        <button onClick={() => refetch()} className="px-4 py-2 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold transition-colors">
          Try again
        </button>
      </div>
    )
  }

  const posts = data?.data ?? []

  if (posts.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <Newspaper className="w-8 h-8 text-bx-muted mx-auto mb-3" />
        <p className="text-bx-white font-medium mb-1">No posts yet</p>
        <p className="text-bx-slate text-sm">Check back soon for new articles.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post) => <BlogCard key={post._id} post={post} />)}
    </div>
  )
}
