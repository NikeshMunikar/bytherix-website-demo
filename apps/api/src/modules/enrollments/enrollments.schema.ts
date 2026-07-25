import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

export const createEnrollmentSchema = {
  body: z.object({ courseId: objectId }),
}

export const enrollmentIdParamSchema = {
  params: z.object({ id: objectId }),
}

export const updateProgressSchema = {
  params: z.object({ id: objectId }),
  body: z.object({
    progress:         z.number().min(0).max(100).optional(),
    completedLessons: z.array(z.string().min(1)).optional(),
  }),
}
