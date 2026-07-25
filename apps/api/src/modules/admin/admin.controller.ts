import type { Request, Response, NextFunction } from 'express'
import { adminService }                           from './admin.service'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const adminController = {
  stats: wrap(async (_req, res) => {
    const stats = await adminService.getStats()
    res.json({ success: true, data: stats })
  }),

  auditLogs: wrap(async (req, res) => {
    const { page, limit, action } = req.query as unknown as { page: number; limit: number; action?: string }
    const result = await adminService.listAuditLogs(page, limit, { action })
    res.json({
      success: true,
      data:    result.logs,
      meta:    { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
    })
  }),

  sessions: wrap(async (req, res) => {
    const { page, limit } = req.query as unknown as { page: number; limit: number }
    const result = await adminService.listSessions(page, limit)
    res.json({
      success: true,
      data:    result.sessions,
      meta:    { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
    })
  }),
}
