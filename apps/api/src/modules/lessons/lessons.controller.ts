import type { Request, Response, NextFunction } from 'express'
import { lessonsService } from './lessons.service'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const lessonsController = {
  listForCourse: wrap(async (req, res) => {
    const lessons = await lessonsService.listForCourse(req.params.courseId as string, req.user?._id as never, req.user?.role)
    res.json({ success: true, data: lessons })
  }),

  getById: wrap(async (req, res) => {
    const lesson = await lessonsService.getById(req.params.id as string, req.user?._id as never, req.user?.role)
    res.json({ success: true, data: lesson })
  }),

  create: wrap(async (req, res) => {
    const lesson = await lessonsService.create(req.body)
    res.status(201).json({ success: true, data: lesson })
  }),

  update: wrap(async (req, res) => {
    const lesson = await lessonsService.update(req.params.id as string, req.body)
    res.json({ success: true, data: lesson })
  }),

  remove: wrap(async (req, res) => {
    await lessonsService.remove(req.params.id as string)
    res.json({ success: true, message: 'Lesson deleted' })
  }),

  reorder: wrap(async (req, res) => {
    await lessonsService.reorder(req.body.lessonIds)
    res.json({ success: true, message: 'Lessons reordered' })
  }),
}
