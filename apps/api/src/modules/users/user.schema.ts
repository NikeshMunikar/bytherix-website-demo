import { z } from 'zod'

export const updateMeSchema = {
  body: z.object({
    firstName: z.string().min(2).max(50).trim().optional(),
    lastName:  z.string().min(2).max(50).trim().optional(),
    avatar:    z.string().url().optional(),
  }),
}

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user id')

export const listUsersSchema = {
  query: z.object({
    q:     z.string().trim().min(1).optional(),
    role:  z.enum(['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN']).optional(),
    page:  z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
}

export const userIdParamSchema = {
  params: z.object({ id: objectId }),
}

export const updateUserRoleSchema = {
  params: z.object({ id: objectId }),
  body:   z.object({ role: z.enum(['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN']) }),
}
