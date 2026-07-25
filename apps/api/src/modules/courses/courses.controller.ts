import type { Request, Response, NextFunction } from 'express'
import { coursesService }                         from './courses.service'
import type { CourseListFilters }                  from './courses.repository'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const coursesController = {
  list: wrap(async (req, res) => {
    const result = await coursesService.list(req.query as unknown as CourseListFilters)
    res.json({
      success: true,
      data:    result.courses,
      meta:    { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
    })
  }),

  listAdmin: wrap(async (req, res) => {
    const result = await coursesService.listForAdmin(req.query as never)
    res.json({
      success: true,
      data:    result.courses,
      meta:    { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
    })
  }),

  getByIdAdmin: wrap(async (req, res) => {
    const course = await coursesService.getById(req.params.id as string)
    res.json({ success: true, data: course })
  }),

  getBySlug: wrap(async (req, res) => {
    const course = await coursesService.getBySlug(req.params.slug as string)
    res.json({ success: true, data: course })
  }),

  create: wrap(async (req, res) => {
    const course = await coursesService.create(req.body, req.user!._id as never)
    res.status(201).json({ success: true, data: course })
  }),

  update: wrap(async (req, res) => {
    const course = await coursesService.update(req.params.id as string, req.body)
    res.json({ success: true, data: course })
  }),

  remove: wrap(async (req, res) => {
    await coursesService.remove(req.params.id as string)
    res.json({ success: true, message: 'Course deleted' })
  }),
}
