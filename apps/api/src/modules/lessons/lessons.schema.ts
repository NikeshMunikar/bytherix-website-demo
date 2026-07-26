import { z } from 'zod'

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

export const courseIdParamSchema = {
  params: z.object({ courseId: objectId }),
}

export const lessonIdParamSchema = {
  params: z.object({ id: objectId }),
}

const lessonBody = z.object({
  course:       objectId,
  title:        z.string().min(2).max(200).trim(),
  description:  z.string().max(2000).optional(),
  order:        z.number().int().min(0).optional(),
  durationMins: z.number().min(0).optional(),
  videoSource:  z.enum(['youtube', 'vimeo', 'upload', 'external']),
  videoUrl:     z.string().min(1),
  isPreview:    z.boolean().optional(),
})

export const createLessonSchema = { body: lessonBody }

export const updateLessonSchema = {
  params: lessonIdParamSchema.params,
  body:   lessonBody.partial(),
}

export const reorderLessonsSchema = {
  body: z.object({
    lessonIds: z.array(objectId).min(1),
  }),
}
