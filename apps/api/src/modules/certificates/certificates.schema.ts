import { z } from 'zod'

export const certificateIdParamSchema = {
  params: z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid certificate id') }),
}

export const certificateNumberParamSchema = {
  params: z.object({ certificateNumber: z.string().min(5).max(50) }),
}
