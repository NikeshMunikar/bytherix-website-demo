import type { Metadata } from 'next'
import { PostForm } from '@/components/admin/PostForm'

export const metadata: Metadata = { title: 'New Post', robots: { index: false, follow: false } }

export default function NewPostPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-bx-white">New post</h2>
      <PostForm />
    </div>
  )
}
