import type { Request, Response, NextFunction } from 'express'
import jwt                                        from 'jsonwebtoken'
import { config }                                 from '../config'
import { UnauthorizedError }                      from '../shared/errors/AppError'
import { UserRepository }                         from '../modules/users/user.repository'

const repo = new UserRepository()

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedError('No token provided')

    const token   = header.slice(7)
    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as { sub: string; role: string }

    const user = await repo.findById(payload.sub)
    if (!user || !user.isActive) throw new UnauthorizedError('User not found or inactive')

    req.user = user
    next()
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) next(new UnauthorizedError('Invalid or expired token'))
    else next(err)
  }
}

// Attaches req.user when a valid bearer token is present, but never rejects
// the request — for public endpoints whose response varies by auth state
// (e.g. lesson video access: preview vs. enrolled vs. anonymous).
export async function authenticateOptional(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) { next(); return }

  try {
    const token   = header.slice(7)
    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as { sub: string; role: string }
    const user    = await repo.findById(payload.sub)
    if (user?.isActive) req.user = user
  } catch {
    // Invalid/expired token on an optional-auth route — proceed as anonymous
  }
  next()
}