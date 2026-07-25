import { User }        from './user.model'
import type { IUser }  from './user.types'

export class UserRepository {
  findById(id: string)                         { return User.findById(id) }
  findByIdWithPassword(id: string)             { return User.findById(id).select('+password') }
  findByEmail(email: string, withPw = false)   {
    const q = User.findOne({ email: email.toLowerCase() })
    return withPw ? q.select('+password') : q
  }
  findByVerificationToken(token: string) {
    return User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpiry')
  }
  findByResetToken(token: string) {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpiry: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpiry')
  }
  create(data: Partial<IUser>)                { return User.create(data) }
  update(id: string, data: Partial<IUser>)    { return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }) }
  softDelete(id: string)                      { return User.findByIdAndUpdate(id, { deletedAt: new Date(), isActive: false }) }
  findAllPaginated(page: number, limit: number, filters: { q?: string; role?: string } = {}) {
    const skip = (page - 1) * limit
    const query: Record<string, unknown> = {}
    if (filters.role) query.role = filters.role
    if (filters.q) {
      const re = new RegExp(filters.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      query.$or = [{ firstName: re }, { lastName: re }, { email: re }]
    }
    return Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]).then(([users, total]) => ({ users, total, page, limit, pages: Math.max(Math.ceil(total / limit), 1) }))
  }
}