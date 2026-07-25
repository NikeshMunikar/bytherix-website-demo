import { User }           from '../users/user.model'
import { Course }         from '../courses/course.model'
import { Enrollment }     from '../enrollments/enrollment.model'
import { ContactMessage } from '../contact/contact.model'
import { AuditLog }       from '../audit/audit.model'
import { Session }        from '../sessions/session.model'

export class AdminService {
  async getStats() {
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalUsers, newUsersThisWeek,
      totalCourses, publishedCourses,
      totalEnrollments, activeEnrollments,
      unresolvedMessages,
      revenueAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: since7d } }),
      Course.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: 'ACTIVE' }),
      ContactMessage.countDocuments({ isResolved: false }),
      Enrollment.aggregate([
        { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'course' } },
        { $unwind: '$course' },
        { $group: { _id: null, revenue: { $sum: '$course.price' } } },
      ]),
    ])

    return {
      totalUsers,
      newUsersThisWeek,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      activeEnrollments,
      unresolvedMessages,
      estimatedRevenue: (revenueAgg[0]?.revenue as number) ?? 0,
    }
  }

  async listAuditLogs(page: number, limit: number, filters: { action?: string | undefined }) {
    const query: Record<string, unknown> = {}
    if (filters.action) query.action = filters.action

    const skip = (page - 1) * limit
    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
        .populate('userId', 'firstName lastName email').lean(),
      AuditLog.countDocuments(query),
    ])

    return { logs, total, page, limit, pages: Math.max(Math.ceil(total / limit), 1) }
  }

  async listSessions(page: number, limit: number) {
    const query = { isRevoked: false, expiresAt: { $gt: new Date() } }
    const skip  = (page - 1) * limit
    const [sessions, total] = await Promise.all([
      Session.find(query).select('-tokenHash').sort({ lastUsedAt: -1 }).skip(skip).limit(limit)
        .populate('userId', 'firstName lastName email').lean(),
      Session.countDocuments(query),
    ])

    return { sessions, total, page, limit, pages: Math.max(Math.ceil(total / limit), 1) }
  }
}

export const adminService = new AdminService()
