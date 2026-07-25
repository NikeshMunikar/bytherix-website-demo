import { z } from 'zod'

export const listCoursesSchema = {
  query: z.object({
    q:        z.string().trim().min(1).optional(),
    category: z.string().trim().min(1).optional(),
    level:    z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    featured: z.coerce.boolean().optional(),
    page:     z.coerce.number().int().min(1).default(1),
    limit:    z.coerce.number().int().min(1).max(50).default(12),
  }),
}

export const slugParamSchema = {
  params: z.object({ slug: z.string().min(1) }),
}

export const idParamSchema = {
  params: z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id') }),
}

const courseBody = z.object({
  title:         z.string().min(3).max(200).trim(),
  slug:          z.string().min(3).max(220).regex(/^[a-z0-9-]+$/i, 'Slug may only contain letters, numbers and hyphens').optional(),
  description:   z.string().min(20).max(5000),
  thumbnail:     z.string().url(),
  category:      z.string().min(2).max(60).trim(),
  price:         z.number().min(0),
  originalPrice: z.number().min(0),
  currency:      z.string().length(3).optional(),
  duration:      z.number().min(0),
  level:         z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  tags:          z.array(z.string().trim().min(1)).max(20).optional(),
  badge:         z.enum(['BESTSELLER', 'TOP_RATED', 'POPULAR', 'NEW']).optional(),
  isPublished:   z.boolean().optional(),
  isFeatured:    z.boolean().optional(),
})

export const createCourseSchema = {
  body: courseBody,
}

export const updateCourseSchema = {
  params: idParamSchema.params,
  body:   courseBody.partial(),
}
