'use client'
import { use } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useAdminPost } from '@/hooks/useAdminPosts'
import { PostForm } from '@/components/admin/PostForm'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: post, isLoading, isError } = useAdminPost(id)

  if (isLoading) {
    return <div className="bx-card rounded-2xl p-6 max-w-2xl h-96 animate-pulse" />
  }

  if (isError || !post) {
    return (
      <div className="bx-card rounded-2xl p-10 text-center max-w-2xl">
        <AlertTriangle className="w-6 h-6 text-bx-red mx-auto mb-2" />
        <p className="text-bx-slate text-sm">Couldn&apos;t load this post.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-bx-white">Edit post</h2>
      <PostForm post={post} />
    </div>
  )
}
