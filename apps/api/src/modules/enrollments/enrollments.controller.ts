import type { Request, Response, NextFunction } from 'express'
import { enrollmentsService }                     from './enrollments.service'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const enrollmentsController = {
  create: wrap(async (req, res) => {
    const enrollment = await enrollmentsService.enroll(req.user!._id as never, req.body.courseId)
    res.status(201).json({ success: true, data: enrollment })
  }),

  listMine: wrap(async (req, res) => {
    const enrollments = await enrollmentsService.listForUser(req.user!._id as never)
    res.json({ success: true, data: enrollments })
  }),

  getProgress: wrap(async (req, res) => {
    const enrollment = await enrollmentsService.getProgress(req.params.id as string, req.user!._id as never, req.user!.role)
    res.json({ success: true, data: enrollment })
  }),

  updateProgress: wrap(async (req, res) => {
    const enrollment = await enrollmentsService.updateProgress(
      req.params.id as string, req.user!._id as never, req.user!.role, req.body,
    )
    res.json({ success: true, data: enrollment })
  }),
}
