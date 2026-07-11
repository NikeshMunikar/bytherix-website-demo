import type { Request, Response, NextFunction } from 'express'
import { ForbiddenError, UnauthorizedError }     from '../shared/errors/AppError'
import type { UserRole }                          from '../modules/users/user.types'

const hierarchy: Record<UserRole, number> = {
  USER: 1, MODERATOR: 2, ADMIN: 3, SUPER_ADMIN: 4,
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) { next(new UnauthorizedError()); return }
    const level    = hierarchy[req.user.role]
    const required = Math.min(...roles.map((r) => hierarchy[r]))
    if (level < required) { next(new ForbiddenError()); return }
    next()
  }
}