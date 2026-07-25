import { z } from 'zod'

export const listAuditLogsSchema = {
  query: z.object({
    action: z.string().trim().min(1).optional(),
    page:   z.coerce.number().int().min(1).default(1),
    limit:  z.coerce.number().int().min(1).max(100).default(30),
  }),
}

export const listSessionsSchema = {
  query: z.object({
    page:  z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(30),
  }),
}
