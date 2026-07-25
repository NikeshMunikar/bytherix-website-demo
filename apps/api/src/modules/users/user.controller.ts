import type { Request, Response, NextFunction } from 'express'
import { UserRepository }                         from './user.repository'
import { NotFoundError, ForbiddenError }          from '../../shared/errors/AppError'
import type { UserListFilters }                    from './user.types'

const repo = new UserRepository()

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const userController = {
  me: wrap(async (req, res) => {
    res.json({ success: true, data: req.user })
  }),

  updateMe: wrap(async (req, res) => {
    const updated = await repo.update(req.user!._id as never, req.body)
    res.json({ success: true, data: updated })
  }),

  list: wrap(async (req, res) => {
    const { page, limit, ...filters } = req.query as unknown as UserListFilters & { page: number; limit: number }
    const result = await repo.findAllPaginated(page, limit, filters)
    res.json({
      success: true,
      data:    result.users,
      meta:    { total: result.total, page: result.page, limit: result.limit, pages: result.pages },
    })
  }),

  updateRole: wrap(async (req, res) => {
    const target = await repo.findById(req.params.id as string)
    if (!target) throw new NotFoundError('User')
    if (target._id.toString() === (req.user!._id as never as string).toString()) {
      throw new ForbiddenError('You cannot change your own role')
    }
    const updated = await repo.update(req.params.id as string, { role: req.body.role })
    res.json({ success: true, data: updated })
  }),

  remove: wrap(async (req, res) => {
    const target = await repo.findById(req.params.id as string)
    if (!target) throw new NotFoundError('User')
    if (target._id.toString() === (req.user!._id as never as string).toString()) {
      throw new ForbiddenError('You cannot delete your own account here')
    }
    await repo.softDelete(req.params.id as string)
    res.json({ success: true, message: 'User deleted' })
  }),
}
