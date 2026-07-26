import type { Request, Response, NextFunction } from 'express'
import { paymentsService } from './payments.service'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const paymentsController = {
  initiate: wrap(async (req, res) => {
    const result = await paymentsService.initiate(req.user!._id as never, req.body.courseId)
    res.status(201).json({ success: true, data: result })
  }),

  verify: wrap(async (req, res) => {
    const result = await paymentsService.verifyEsewaCallback(req.body.data, req.user!._id as never)
    res.json({ success: true, data: result })
  }),

  markFailed: wrap(async (req, res) => {
    await paymentsService.markFailed(req.body.transactionUuid)
    res.json({ success: true, message: 'Payment marked as failed' })
  }),

  listMine: wrap(async (req, res) => {
    const payments = await paymentsService.listForUser(req.user!._id as never)
    res.json({ success: true, data: payments })
  }),
}
