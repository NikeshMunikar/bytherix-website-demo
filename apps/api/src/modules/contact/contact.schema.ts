import { z } from 'zod'

export const submitContactSchema = {
  body: z.object({
    name:    z.string().min(2).max(100).trim(),
    email:   z.string().email().toLowerCase(),
    subject: z.string().min(3).max(150).trim(),
    message: z.string().min(20).max(5000),
    type:    z.enum(['general', 'course', 'project', 'quote']).default('general'),
  }),
}
