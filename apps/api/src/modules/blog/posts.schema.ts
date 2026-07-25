import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

export const listPostsSchema = {
  query: z.object({
    q:     z.string().trim().min(1).optional(),
    tag:   z.string().trim().min(1).optional(),
    page:  z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
  }),
}

export const slugParamSchema = {
  params: z.object({ slug: z.string().min(1) }),
}

export const idParamSchema = {
  params: z.object({ id: objectId }),
}

const postBody = z.object({
  title:        z.string().min(3).max(200).trim(),
  slug:         z.string().min(3).max(220).regex(/^[a-z0-9-]+$/i, 'Slug may only contain letters, numbers and hyphens').optional(),
  excerpt:      z.string().min(10).max(500),
  content:      z.string().min(50),
  coverImage:   z.string().url(),
  tags:         z.array(z.string().trim().min(1)).max(10).optional(),
  readTimeMins: z.number().min(1).max(180).optional(),
  isPublished:  z.boolean().optional(),
})

export const createPostSchema = { body: postBody }

export const updatePostSchema = {
  params: idParamSchema.params,
  body:   postBody.partial(),
}
