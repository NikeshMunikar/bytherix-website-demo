import type { Request, Response, NextFunction } from 'express'
import { postsService }                           from './posts.service'
import type { PostListFilters }                    from './posts.repository'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const postsController = {
  list: wrap(async (req, res) => {
    const result = await postsService.list(req.query as unknown as PostListFilters)
    res.json({
      success: true,
      data:    result.posts,
      meta:    { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
    })
  }),

  listAdmin: wrap(async (req, res) => {
    const result = await postsService.listForAdmin(req.query as never)
    res.json({
      success: true,
      data:    result.posts,
      meta:    { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
    })
  }),

  getBySlug: wrap(async (req, res) => {
    const post = await postsService.getBySlug(req.params.slug as string)
    res.json({ success: true, data: post })
  }),

  getByIdAdmin: wrap(async (req, res) => {
    const post = await postsService.getById(req.params.id as string)
    res.json({ success: true, data: post })
  }),

  create: wrap(async (req, res) => {
    const post = await postsService.create(req.body, req.user!._id as never)
    res.status(201).json({ success: true, data: post })
  }),

  update: wrap(async (req, res) => {
    const post = await postsService.update(req.params.id as string, req.body)
    res.json({ success: true, data: post })
  }),

  remove: wrap(async (req, res) => {
    await postsService.remove(req.params.id as string)
    res.json({ success: true, message: 'Post deleted' })
  }),
}
