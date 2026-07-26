import { z } from 'zod'

export const initiatePaymentSchema = {
  body: z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course id'),
  }),
}

export const verifyPaymentSchema = {
  body: z.object({
    data: z.string().min(1),
  }),
}

export const markFailedSchema = {
  body: z.object({
    transactionUuid: z.string().min(1),
  }),
}
