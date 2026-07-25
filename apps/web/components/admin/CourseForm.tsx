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
import { useCreateCourse, useUpdateCourse, type CourseInput } from '@/hooks/useAdminCourses'
import type { Course } from '@/lib/types/course'

const schema = z.object({
  title:         z.string().min(3).max(200),
  description:   z.string().min(20).max(5000),
  thumbnail:     z.string().url('Upload a thumbnail image'),
  category:      z.string().min(2).max(60),
  price:         z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0),
  duration:      z.coerce.number().min(0),
  level:         z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  tags:          z.string().optional(),
  badge:         z.enum(['', 'BESTSELLER', 'TOP_RATED', 'POPULAR', 'NEW']).optional(),
  isPublished:   z.boolean().optional(),
  isFeatured:    z.boolean().optional(),
})
type F = z.infer<typeof schema>

const inputClass = 'w-full px-4 py-2.5 rounded-xl bg-bx-navy border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue transition-colors'
const labelClass = 'block text-bx-slate text-sm font-medium mb-1.5'

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter()
  const isEdit = !!course
  const create = useCreateCourse()
  const update = useUpdateCourse()
  const [thumbnail, setThumbnail] = useState(course?.thumbnail ?? '')

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: course ? {
      title: course.title, description: course.description, thumbnail: course.thumbnail,
      category: course.category, price: course.price, originalPrice: course.originalPrice,
      duration: course.duration, level: course.level, tags: course.tags?.join(', '),
      badge: course.badge ?? '', isPublished: course.isPublished, isFeatured: course.isFeatured,
    } : { level: 'BEGINNER', isPublished: false, isFeatured: false },
  })

  const onSubmit = async (data: F) => {
    const input: CourseInput = {
      title: data.title, description: data.description, thumbnail: data.thumbnail, category: data.category,
      price: data.price, originalPrice: data.originalPrice, duration: data.duration, level: data.level,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      badge: data.badge, isPublished: data.isPublished, isFeatured: data.isFeatured,
    }
    try {
      if (isEdit) {
        await update.mutateAsync({ id: course._id, input })
        toast.success('Course updated')
      } else {
        await create.mutateAsync(input)
        toast.success('Course created')
      }
      router.push('/admin/courses')
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined
      toast.error(message ?? 'Could not save course')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bx-card rounded-2xl p-6 space-y-4 max-w-2xl">
      <div>
        <label className={labelClass}>Thumbnail</label>
        <ImageUpload value={thumbnail} onChange={(url) => { setThumbnail(url); setValue('thumbnail', url, { shouldValidate: true }) }} />
        {errors.thumbnail && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.thumbnail.message}</p>}
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input id="title" {...register('title')} className={inputClass} />
        {errors.title && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea id="description" rows={4} {...register('description')} className={inputClass} />
        {errors.description && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>Category</label>
          <input id="category" {...register('category')} className={inputClass} placeholder="Web Development" />
          {errors.category && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.category.message}</p>}
        </div>
        <div>
          <label htmlFor="level" className={labelClass}>Level</label>
          <select id="level" {...register('level')} className={inputClass}>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="price" className={labelClass}>Price (NPR)</label>
          <input id="price" type="number" step="0.01" {...register('price')} className={inputClass} />
          {errors.price && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.price.message}</p>}
        </div>
        <div>
          <label htmlFor="originalPrice" className={labelClass}>Original price</label>
          <input id="originalPrice" type="number" step="0.01" {...register('originalPrice')} className={inputClass} />
          {errors.originalPrice && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.originalPrice.message}</p>}
        </div>
        <div>
          <label htmlFor="duration" className={labelClass}>Duration (hrs)</label>
          <input id="duration" type="number" step="0.5" {...register('duration')} className={inputClass} />
          {errors.duration && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.duration.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="tags" className={labelClass}>Tags (comma-separated)</label>
          <input id="tags" {...register('tags')} className={inputClass} placeholder="react, typescript" />
        </div>
        <div>
          <label htmlFor="badge" className={labelClass}>Badge</label>
          <select id="badge" {...register('badge')} className={inputClass}>
            <option value="">None</option>
            <option value="BESTSELLER">Bestseller</option>
            <option value="TOP_RATED">Top Rated</option>
            <option value="POPULAR">Popular</option>
            <option value="NEW">New</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-bx-slate">
          <input type="checkbox" {...register('isPublished')} className="rounded border-bx-border" /> Published
        </label>
        <label className="flex items-center gap-2 text-sm text-bx-slate">
          <input type="checkbox" {...register('isFeatured')} className="rounded border-bx-border" /> Featured
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}
        className="px-5 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create course'}
      </button>
    </form>
  )
}
