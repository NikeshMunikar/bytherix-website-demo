'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/common/ImageUpload'
import { useCreatePost, useUpdatePost, type PostInput } from '@/hooks/useAdminPosts'
import type { Post } from '@/lib/types/post'

const schema = z.object({
  title:       z.string().min(3).max(200),
  excerpt:     z.string().min(10).max(500),
  content:     z.string().min(50),
  coverImage:  z.string().url('Upload a cover image'),
  tags:        z.string().optional(),
  isPublished: z.boolean().optional(),
})
type F = z.infer<typeof schema>

const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-bx-navy border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue transition-colors'
const labelClass = 'block text-bx-slate text-sm font-medium mb-1.5'

export function PostForm({ post }: { post?: Post }) {
  const router = useRouter()
  const isEdit = !!post
  const create = useCreatePost()
  const update = useUpdatePost()
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '')

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: post ? {
      title: post.title, excerpt: post.excerpt, content: post.content, coverImage: post.coverImage,
      tags: post.tags.join(', '), isPublished: post.isPublished,
    } : { isPublished: false },
  })

  const onSubmit = async (data: F) => {
    const input: PostInput = {
      title: data.title, excerpt: data.excerpt, content: data.content, coverImage: data.coverImage,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      isPublished: data.isPublished,
    }
    try {
      if (isEdit) {
        await update.mutateAsync({ id: post._id, input })
        toast.success('Post updated')
      } else {
        await create.mutateAsync(input)
        toast.success('Post created')
      }
      router.push('/admin/blog')
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined
      toast.error(message ?? 'Could not save post')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bx-card rounded-2xl p-6 space-y-4 max-w-2xl">
      <div>
        <label className={labelClass}>Cover image</label>
        <ImageUpload value={coverImage} onChange={(url) => { setCoverImage(url); setValue('coverImage', url, { shouldValidate: true }) }} />
        {errors.coverImage && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.coverImage.message}</p>}
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input id="title" {...register('title')} className={inputClass} />
        {errors.title && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
        <textarea id="excerpt" rows={2} {...register('excerpt')} className={inputClass} placeholder="A short summary shown on the blog listing" />
        {errors.excerpt && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.excerpt.message}</p>}
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>Content</label>
        <textarea id="content" rows={12} {...register('content')} className={inputClass} placeholder="Separate paragraphs with a blank line" />
        {errors.content && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.content.message}</p>}
      </div>

      <div>
        <label htmlFor="tags" className={labelClass}>Tags (comma-separated)</label>
        <input id="tags" {...register('tags')} className={inputClass} placeholder="security, tutorials" />
      </div>

      <label className="flex items-center gap-2 text-sm text-bx-slate">
        <input type="checkbox" {...register('isPublished')} className="rounded border-bx-border" /> Published
      </label>

      <button type="submit" disabled={isSubmitting}
        className="px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Publish post'}
      </button>
    </form>
  )
}
