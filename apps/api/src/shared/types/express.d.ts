import type { IUser } from '../../modules/users/user.types'

declare global {
  namespace Express {
    interface Request {
      user?:          IUser
      correlationId?: string
    }
  }
}